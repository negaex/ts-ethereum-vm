import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Block, emptyBlock } from './block';
import { List } from 'immutable';
import { Transaction } from './transaction';
import { genesisBlock } from '../run/genesis';
import { Address, Accounts } from './account';

interface BlockchainInterface {
  blocks: List<Block>;
}

export class Blockchain extends Record<BlockchainInterface>({
  blocks: List<Block>([])
}) {

  addBlock(block: Block): Blockchain {
    let blockchain: Blockchain = this;
    if (block.pending) {
      block = block.commit();
    }
    blockchain = blockchain.set('blocks', blockchain.blocks.push(block));
    return blockchain;
  }

  getBalance(address: Address): N256 {
    return this.blocks.last().accounts.get(address).balance;
  }

  getAccounts(): Accounts {
    return this.blocks.last().accounts;
  }

}

export const emptyBlockchain: Blockchain = new Blockchain().addBlock(genesisBlock);