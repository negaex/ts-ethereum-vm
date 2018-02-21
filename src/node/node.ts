import { Blockchain, emptyBlockchain } from '../state/blockchain';
import { Block, newBlock } from '../state/block';
import { Transaction } from '../state/transaction';
import { Account, Address } from '../state/account';
import { N256, Ox0 } from '../lib/N256';
import { assemble } from '../assembler/assembler';

export class Node {

  blockchain: Blockchain = emptyBlockchain;
  pending: Block;
  coinbase: Address = Ox0;

  constructor(coinbase: Address) {
    this.setCoinbase(coinbase);
  }

  setCoinbase(coinbase: Address) {
    this.coinbase = coinbase;
  }

  getAccounts() {
    if (this.pending) {
      return this.pending.accounts;
    }
    return this.blockchain.blocks.last().accounts;
  }

  checkPending() {
    if (!this.pending) {
      this.pending = newBlock(this.coinbase, this.getAccounts());
    }
  }

  submitTransaction(transaction: Transaction) {
    this.checkPending();

    this.pending = this.pending.addTransaction(transaction);
    this.mine();
  }

  newTransaction(from: Address, to: Address, value: N256, data: string) {
    this.checkPending();

    const fromAccount = this.pending.accounts.get(from);
    const transaction = new Transaction({
      nonce: fromAccount.nonce,
      to: to,
      value: value,
      data: assemble(data),
    });

    this.submitTransaction(transaction);
  }

  deployContract(from: Address, data: string, value: N256 = Ox0) {
    this.newTransaction(from, Ox0, value, data);
  }

  mine() {
    this.blockchain = this.blockchain.addBlock(this.pending);
    this.pending = null;
  }

  balanceOf(address: Address, pending: boolean = true): N256 {
    if (pending && this.pending) {
      return this.pending.accounts.get(address).balance;
    } else {
      return this.blockchain.getBalance(address);
    }
  }

}