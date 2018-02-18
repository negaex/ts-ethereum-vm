import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
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
  nonce: Ox0,
  gasPrice: Ox0,
  gasLimit: Ox0,
  to: Ox0,
  value: Ox0,
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