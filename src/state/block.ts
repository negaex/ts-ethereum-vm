import { Record } from '../lib/record';
import { N256 } from '../lib/N256';
import { Transaction } from './transaction';
import { List } from 'immutable';

const Ox0 = new N256(0);

interface BlockInterface {
  parentHash: N256;
  // ommersHash: N256;
  beneficiary: N256;
  // stateRoot: N256;
  // transactionsRoot: N256;
  // receiptsRoot: N256;
  // logsBloom: ...;
  // difficulty: number;
  number: N256;
  gasLimit: N256;
  gasUsed: N256;
  timestamp: N256;
  // extraData: N256;
  // mixHash: N256;
  // nonce: N256;

  pending: boolean;
  transactions: List<Transaction>;
}

export class Block extends Record<BlockInterface>({
  parentHash: Ox0,
  beneficiary: Ox0,
  number: Ox0,
  gasLimit: Ox0,
  gasUsed: Ox0,
  timestamp: Ox0,
  pending: true,
  transactions: List<Transaction>(),
}) {}