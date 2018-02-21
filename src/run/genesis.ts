import { Block } from '../state/block';
import { Ox0, Ox1, N256 } from '../lib/N256';
import { Transaction } from '../state/transaction';
import { List } from 'immutable';
import { Accounts, Account } from '../state/account';

export const genesisBlock = new Block({
  parentHash: Ox0,
  beneficiary: Ox0,
  difficulty: Ox0,
  number: Ox0,
  gasLimit: Ox0,
  gasUsed: Ox0,
  timestamp: Ox0,
  pending: false,
  transactions: List<Transaction>(),
  
  accounts: new Accounts().set(
    new N256(0),
    new Account({
      balance: Ox1 // TODO: Remove
    })
  ),
});