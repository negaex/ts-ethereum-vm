import { Record } from '../lib/record';
import { N256 } from '../lib/N256';
import { Account } from './account';

interface TransactionInterface {
  nonce: N256;
  gasPrice: N256;
  gasLimit: N256;
  to: N256;
  value: N256;
  data: Buffer; // Should be hash of code instead
}

export class Transaction extends Record<TransactionInterface>({
  nonce: new N256(0),
  gasPrice: new N256(0),
  gasLimit: new N256(0),
  to: new N256(0),
  value: new N256(0),
  data: Buffer.from([]),
}) {}

function newTransaction(from: Account, to: Account, value: N256, data: Buffer) {
  return new Transaction({
    nonce: from.nonce,
    to: to.getAddress(),
    value: value,
    data: data,
  });
}