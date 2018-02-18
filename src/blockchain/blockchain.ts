import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Block } from '../state/block';

interface BlockchainInterface {
  blocks: Map<N256, Block>;
  latest: N256;
}

export class Blockchain extends Record<BlockchainInterface>({
  blocks: new Map<N256, Block>(),
  latest: Ox0,
}) {}

export const emptyBlockchain = new Blockchain();