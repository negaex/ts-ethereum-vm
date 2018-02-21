import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Account, Address, Accounts, emptyAccounts } from './account';
import { MachineState, emptyMachineState } from './machinestate';
import { Storage } from './storage';
import { Block, emptyBlock } from './block';
import { VMError } from '../errors';
import { run } from '../run/run';
import { sha3 } from '../lib/sha3';

interface TransactionInterface {
  nonce: N256;
  gasPrice: N256;
  gasLimit: N256;
  from: Address; // Instead of signature
  to: Address;
  value: N256;
  data: Buffer; // Should be hash of code instead
  accounts: Accounts;
}

export class Transaction extends Record<TransactionInterface>({
  nonce: Ox0,
  gasPrice: Ox0,
  gasLimit: Ox0,
  from: Ox0,
  to: Ox0,
  value: Ox0,
  data: Buffer.from([]),
  accounts: emptyAccounts,
}) {

  process(block: Block): MachineState {
    let state = emptyMachineState;
    state = state.set('currentBlock', block);
    state = state.set('currentTransaction', this);
    state = state.set('accounts', this.accounts);
    let accounts = state.get('accounts');
    let fromAccount = accounts.get(this.from);

    const deployingContract: boolean = this.to.isZero();

    let toAccount;
    let to = this.to;
    if (deployingContract) {
      // TODO: Implement RLP encoding
      to = sha3(fromAccount.address.add(fromAccount.nonce));
      toAccount = accounts.get(to);
    } else {
      toAccount = accounts.get(this.to);
    }

    if (fromAccount.balance.lessThan(this.value)) {
      throw new VMError('Insufficient balance');
    }
    fromAccount = fromAccount.set('balance', fromAccount.balance.sub(this.value));
    toAccount = toAccount.set('balance', toAccount.balance.add(this.value));
    accounts = accounts.set(this.from, fromAccount).set(to, toAccount);
    state = state.set('accounts', accounts);
    state = state.set('address', to);
    state = state.set('caller', this.from);

    if (deployingContract) {
      state = state.set('code', this.data);
      state = state.set('callData', this.data);
      const uploadedCode = run(state, true).returnValue;
      toAccount = toAccount.set('code', uploadedCode);
      // TODO: If someone has the private keys (very unlikely), is it set to 1 or nonce+1?
      toAccount = toAccount.set('nonce', toAccount.nonce.add(1));
      accounts = accounts.set(this.from, fromAccount).set(to, toAccount);
      state = state.set('accounts', accounts);
    } else {
      const code = this.accounts.get(to).code;
      state = state.set('code', accounts.get(to).code);
      state = state.set('callData', this.data);
      state = run(state, true);
    }

    accounts = state.accounts;
    fromAccount = accounts.get(this.from);
    fromAccount = fromAccount.set('nonce', fromAccount.nonce.add(1));
    accounts = accounts.set(this.from, fromAccount);
    state = state.set('accounts', accounts);

    return state;
  }

}

export const emptyTransaction = new Transaction();