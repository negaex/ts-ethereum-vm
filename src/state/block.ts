import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Address } from './account';
import { Transaction } from './transaction';
import { List } from 'immutable';
import { MachineState, emptyMachineState } from './machinestate';
import { Storage } from './storage';
import { run } from '../run/run';
import { Account } from './account';

interface BlockInterface {
  parentHash: N256;
  // ommersHash: N256;
  beneficiary: N256;
  // stateRoot: N256;
  // transactionsRoot: N256;
  // receiptsRoot: N256;
  // logsBloom: ...;
  difficulty: N256;
  number: N256;
  gasLimit: N256;
  gasUsed: N256;
  timestamp: N256;
  // extraData: N256;
  // mixHash: N256;
  // nonce: N256;

  pending: boolean;
  transactions: List<Transaction>;
  accounts: Map<Address, Account>;
}

export class Block extends Record<BlockInterface>({
  parentHash: Ox0,
  beneficiary: Ox0,
  difficulty: Ox0,
  number: Ox0,
  gasLimit: Ox0,
  gasUsed: Ox0,
  timestamp: Ox0,
  pending: true,
  transactions: List<Transaction>(),
  
  accounts: new Map<Address, Account>(),
}) {

  commit(): Block {
    if (!this.pending) {
      throw new Error('Block already commited.');
    }
    return this.set('pending', false);
  }

  addTransaction(tx: Transaction): Block {
    if (!this.pending) {
      throw new Error('Block already commited.');
    }

    tx = tx.set('accounts', this.accounts);
    const newState = tx.process(this);

    // ...

    return this;
  }

}

export const emptyBlock = new Block();