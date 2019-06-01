import { Interface, Record } from '../lib/record';
import { N256, Ox0, Ox1 } from '../lib/N256';
import { Account, Address, Accounts, emptyAccounts } from './account';
import { MachineState, emptyMachineState } from './machinestate';
import { Storage } from './storage';
import { Block, emptyBlock } from './block';
import { VMError } from '../errors';
import { run } from '../run/run';
import { sha3 } from '../lib/sha3';
import { Signature, ecrecover, ecsign } from '../crypto/crypto';

const rlp = require('rlp');

export const contractAddress = (creator: Address, nonce: N256): Address => {
  const raw = [
    creator.toBuffer(true),
    nonce.toBuffer(true),
  ];
  return sha3(rlp.encode(raw)).toAddress();
};

export interface TransactionInterface {
  nonce: N256;
  gasPrice: N256;
  gasLimit: N256;
  to: Address;
  value: N256;
  data: Buffer; // Should be hash of code instead
  v: N256;
  r: N256;
  s: N256;
  accounts: Accounts;
}

export class Transaction extends Record<TransactionInterface>({
  nonce: Ox0,
  gasPrice: Ox0,
  gasLimit: Ox0,
  to: Ox0,
  value: Ox0,
  data: Buffer.from([]),
  v: Ox0,
  r: Ox0,
  s: Ox0,
  accounts: emptyAccounts,
}) {

  hash(): N256 {
    const raw = [
      this.nonce.toBuffer(true),
      this.gasPrice.toBuffer(true),
      this.gasLimit.toBuffer(true),
      this.to.toBuffer(true),
      this.value.toBuffer(true),
      this.data,
      // Ox0.toBuffer(true),
      // Ox0.toBuffer(true),
      // Ox0.toBuffer(true),
    ];

    return sha3(rlp.encode(raw));
  }

  sender(): Address {
    const hash = this.hash();
    const chainID = Ox0;
    const v = this.v.sub(chainID.mul(2).add(8));
    const address = ecrecover(hash, this.v, this.r, this.s);
    return address;
  }

  sign(privateKey: N256): Transaction {
    const hash = this.hash();
    const sig: Signature = ecsign(hash, privateKey);

    const chainID = Ox0;
    return this
      .set('v', sig.v.add(chainID.mul(1).add(8)))
      .set('r', sig.r)
      .set('s', sig.s);
  }

  process(block: Block, from: Address, log?: boolean): MachineState {
    let state: MachineState = emptyMachineState;
    state = state.set('currentBlock', block);
    state = state.set('currentTransaction', this);
    state = state.set('accounts', this.accounts);
    let accounts: Accounts = state.get('accounts');

    let fromAccount: Account = accounts.get(from);

    const deployingContract: boolean = this.to.isZero();

    let toAccount: Account;
    let to: N256 = this.to;
    if (deployingContract) {
      // TODO: Implement RLP encoding
      to = contractAddress(fromAccount.address, fromAccount.nonce);
      // to = sha3(fromAccount.address.add(fromAccount.nonce));
      toAccount = accounts.get(to);
    } else {
      toAccount = accounts.get(this.to);
    }

    if (fromAccount.balance.lessThan(this.value)) {
      throw new VMError('Insufficient balance');
    }
    fromAccount = fromAccount.set('balance', fromAccount.balance.sub(this.value));
    toAccount = toAccount.set('balance', toAccount.balance.add(this.value));
    accounts = accounts.set(from, fromAccount).set(to, toAccount);
    state = state.set('accounts', accounts);
    state = state.set('address', to);
    state = state.set('caller', from);
    state = state.set('gasLimit', this.gasLimit.toNumber());

    if (deployingContract) {
      state = state.set('code', this.data);
      state = state.set('callData', this.data);
      const uploadedCode: Buffer = run(state, log).returnValue;
      toAccount = toAccount.set('code', uploadedCode);
      // TODO: If someone has the private keys (very unlikely), is it set to 1 or nonce+1?
      toAccount = toAccount.set('nonce', toAccount.nonce.add(1));
      accounts = accounts.set(from, fromAccount).set(to, toAccount);
      state = state.set('accounts', accounts);
      console.log(`Contract deployed to ${to.toHexAddress()}`);
    } else {
      const code: Buffer = this.accounts.get(to).code;
      state = state.set('code', accounts.get(to).code);
      state = state.set('callData', this.data);
      if (state.get('code').length > 0) {
        state = run(state, log);
      }
    }

    accounts = state.accounts;
    fromAccount = accounts.get(from);
    fromAccount = fromAccount.set('nonce', fromAccount.nonce.add(1));
    accounts = accounts.set(from, fromAccount);
    state = state.set('accounts', accounts);

    return state;
  }

}

export const emptyTransaction: Transaction = new Transaction();