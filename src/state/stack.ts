
import { List } from 'immutable';
import { N256 } from '../lib/N256';

export type Stack = List<N256>;

export const emptyStack: Stack = List<N256>();

export function stackToString(stack: Stack): string {
  return '[ ' + stack.map((n: N256) => n.toBinary()).join(', ') + ' ]';
}