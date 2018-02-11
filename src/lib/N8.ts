import { List } from 'immutable';
import { N256, Bit, BitList, fromNum, pad } from './N256';

type N8Param = number | N8 | BitList;

export const fromN256 = (n: N256): N8[] => {
  const ret: N8[] = [];
  for (let i = 0; i < 256; i += 8) {
    ret.push(new N8(n.value.slice(i, i + 8).toList()));
  }
  return ret;
};

export class N8 {
  value: BitList;

  constructor(num?: N8Param) {
    if (num === undefined) {
      // Undefined
      this.value = List<Bit>(new Array(8).fill(0));
    } else if (num instanceof N8) {
      // N8
      this.value = (num as N8).value;
    } else if (typeof num === 'number') {
      // number
      this.value = fromNum(num, 8);
    } else {
      // BitList
      this.value = pad(num, 8);
    }
  }
}