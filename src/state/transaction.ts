import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Account, Address } from './account';
import { MachineState, emptyMachineState } from './machinestate';
import { Storage } from './storage';
import { Block, emptyBlock } from './block';

interface TransactionInterface {
  nonce: N256;
  gasPrice: N256;
  gasLimit: N256;
  to: N256;
  value: N256;
  data: Buffer; // Should be hash of code instead
  storages: Map<Address, Storage>;

  blockSnapshot: Block;
}

export class Transaction extends Record<TransactionInterface>({
  nonce: Ox0,
  gasPrice: Ox0,
  gasLimit: Ox0,
  to: Ox0,
  value: Ox0,
  data: Buffer.from([]),
  storages: new Map<Address, Storage>(),
  
  blockSnapshot: emptyBlock,
}) {}

function newTransaction(from: Account, to: Account, value: N256, data: Buffer) {
  return new Transaction({
    nonce: from.nonce,
    to: to.address,
    value: value,
    data: data,
  });
}

export const emptyTransaction = new Transaction();