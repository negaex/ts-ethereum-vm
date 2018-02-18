import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Storage, emptyStorage } from './storage';

interface AccountInterface {
  address: N256;
  nonce: N256;
  balance: N256;
  storage: Storage;
  code: Buffer; // Should be hash of code instead
}

export class Account extends Record<AccountInterface>({
  address: Ox0,
  nonce: Ox0,
  balance: Ox0,
  storage: emptyStorage,
  code: Buffer.from([]),
}) {
  getAddress() {
    return this.address;
  }
}