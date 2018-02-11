import { List } from 'immutable';
import { N256 } from './N256';

type N8Value = List<Bit>;
type N8Param = number | N8 | N8Value;
type Bit = 0 | 1;

export const fromN256 = (n: N256): N8[] => {
  const ret: N8[] = [];
  for (let i = 0; i < 256; i += 8) {
    ret.push(new N8(n.value.slice(i, i + 8).toList()));
  }
  return ret;
};

export class N8 {
  value: N8Value;

  constructor(num?: N8Value) {
    this.value = num;
  }

  toN256 = (arr: N8Value): N256 => {
    return new N256();
    // arr = arr.slice(Math.max(0, arr.size - 256)).toList();
    // const diff = 256 - arr.size;
    // return List(new Array(diff).fill(0)).push(...arr.toArray());
  };
}