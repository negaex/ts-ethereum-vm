import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Address } from './account';
import { Transaction } from './transaction';
import { List } from 'immutable';
import { MachineState, emptyMachineState } from './machinestate';
import { Storage } from './storage';
import { run } from '../run/run';
import { Account, Accounts, emptyAccounts } from './account';

interface BlockInterface {
  parentHash: N256;
  // ommersHash: N256;
  beneficiary: Address;
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
  accounts: Accounts;
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
  
  accounts: emptyAccounts,
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
    let block = this;
    tx = tx.set('accounts', this.accounts);
    const newState = tx.process(block);
    block = block.set('accounts', newState.accounts);
    block = block.set('transactions', block.transactions.push(tx));

    return block;
  }

}

export const newBlock = (beneficiary: Address, accounts: Accounts): Block => {
  let block = emptyBlock;
  block = block.set('accounts', accounts);
  block = block.set('beneficiary', beneficiary);
  let beneficiaryAccount = accounts.get(beneficiary);
  beneficiaryAccount = beneficiaryAccount.set('balance', beneficiaryAccount.balance.add(5));
  accounts = accounts.set(beneficiary, beneficiaryAccount);
  block = block.set('accounts', accounts);
  return block;
};

export const emptyBlock = new Block();