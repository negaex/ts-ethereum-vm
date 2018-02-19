import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Account, Address } from './account';
import { MachineState, emptyMachineState } from './machinestate';
import { Storage } from './storage';
import { Block, emptyBlock } from './block';
import { VMError } from '../errors';

interface TransactionInterface {
  nonce: N256;
  gasPrice: N256;
  gasLimit: N256;
  from: Address; // Instead of signature
  to: Address;
  value: N256;
  data: Buffer; // Should be hash of code instead
  accounts: Map<Address, Account>;
}

export class Transaction extends Record<TransactionInterface>({
  nonce: Ox0,
  gasPrice: Ox0,
  gasLimit: Ox0,
  from: Ox0,
  to: Ox0,
  value: Ox0,
  data: Buffer.from([]),
  accounts: new Map<Address, Account>(),
}) {

  process(block: Block): MachineState {
    let state = emptyMachineState;
    state = state.set('currentBlock', block);
    state = state.set('currentTransaction', this);
    state = state.set('accounts', this.accounts);

    if (this.to.isZero()) {
      // Contract deployment
      // TODO
    } else {
      const code = this.accounts.get(this.to).code;
      if (code.length > 0) {
        // Contract call
        // TODO
      } else {
        // Regular transaction
        let accounts = state.get('accounts');
        let fromAccount = accounts.get(this.from);
        let toAccount = accounts.get(this.to);
        if (fromAccount.balance.lessThan(this.value)) {
          throw new VMError('Insufficient balance');
        }
        fromAccount = fromAccount.set('balance', fromAccount.balance.sub(this.value));
        toAccount = toAccount.set('balance', toAccount.balance.add(this.value));
        accounts = accounts.set(this.from, fromAccount).set(this.to, toAccount);
        state = state.set('accounts', accounts);
      }
    }

    return state;
  }

}

function newTransaction(from: Account, to: Account, value: N256, data: Buffer) {
  return new Transaction({
    nonce: from.nonce,
    to: to.address,
    value: value,
    data: data,
  });
}

export const emptyTransaction = new Transaction();