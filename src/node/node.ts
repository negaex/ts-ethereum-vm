import { Blockchain, emptyBlockchain } from '../state/blockchain';
import { Block, newBlock } from '../state/block';
import { Transaction } from '../state/transaction';
import { Account, Accounts, Address } from '../state/account';
import { N256, Ox0 } from '../lib/N256';
import { assemble } from '../assembler/assembler';
import { runRPC } from './rpc_server';

export class Node {

  blockchain: Blockchain = emptyBlockchain;
  pending: Block;
  coinbase: Address = Ox0;

  constructor(coinbase: Address) {
    this.setCoinbase(coinbase);
  }

  setCoinbase(coinbase: Address): void {
    this.coinbase = coinbase;
  }

  getAccounts(): Accounts {
    if (this.pending) {
      return this.pending.accounts;
    }
    return this.blockchain.blocks.last().accounts;
  }

  checkPending(): void {
    if (!this.pending) {
      this.pending = newBlock(this.coinbase, this.getAccounts());
    }
  }

  submitTransaction(transaction: Transaction): void {
    this.checkPending();

    this.pending = this.pending.addTransaction(transaction);
    this.mine();
  }

  newTransaction(from: Address, to: Address, value: N256, data: string): void {
    this.checkPending();

    const fromAccount: Account = this.pending.accounts.get(from);
    const transaction: Transaction = new Transaction({
      nonce: fromAccount.nonce,
      to: to,
      value: value,
      data: assemble(data),
    });

    this.submitTransaction(transaction);
  }

  deployContract(from: Address, data: string, value: N256 = Ox0): void {
    this.newTransaction(from, Ox0, value, data);
  }

  mine(): void {
    this.blockchain = this.blockchain.addBlock(this.pending);
    this.pending = null;
  }

  getBalance(_address: string, status: string): string {
    const address: Address = new N256(Buffer.from(_address, 'hex'));
    // TODO: Check if status is a block number
    if (status === 'pending' && this.pending) {
      return this.pending.accounts.get(address).balance.toHex();
    } else {
      return this.blockchain.getBalance(address).toHex();
    }
  }

  getBlockNumber(): string {
    const n = this.blockchain.blocks.size;
    let nStr = n.toString(16);
    if (nStr.length % 2 == 1) {
      nStr = "0" + nStr;
    }
    return "0x" + nStr;
  }

  runRPC(): void {
    runRPC(this);
  }

  loadState(): void {

  }

}