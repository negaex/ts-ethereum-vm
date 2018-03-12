
import { Map } from 'immutable';
import { N256 } from '../lib/N256';

export type Storage = Map<N256, N256>;

export const emptyStorage: Storage = Map<N256, N256>();

export function storageToString(storage: Storage): string {
  return '{ ' + storage.entrySeq().map(
    (kv: N256[]) => `${kv[0].toNumber().toString()}: ${kv[1].toBinary()}`
  ).join(', ') + ' }';
}