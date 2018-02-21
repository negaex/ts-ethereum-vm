import { Record } from '../lib/record';
import { N256, Ox0 } from '../lib/N256';
import { Storage, emptyStorage } from './storage';
import { Map } from 'immutable';

export type Address = N256;

interface AccountInterface {
  address: Address;
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
}) { }

export const emptyAccount = new Account();

export class Accounts {
  inner: Map<Address, Account>;
  
  constructor(inner: Map<Address, Account> = Map<Address, Account>()) {
    this.inner = inner;
  }

  get(address: Address) {
    return this.inner.get(address) || emptyAccount;
  }

  set(address: Address, account: Account): Accounts {
    return new Accounts(this.inner.set(address, account));
  }
}

export const emptyAccounts: Accounts = new Accounts();