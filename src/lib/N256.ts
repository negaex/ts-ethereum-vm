
import { List } from 'immutable';

type N256Value = List<Bit>;
type N256Param = number | N256 | N256Value;
type Bit = 0 | 1;

const pad = (arr: N256Value): N256Value => {
  const diff = 256 - arr.size;
  return arr.push(...new Array(diff).fill(0));
};

const fromNum = (bin: number): N256Value => {
  const arr = bin.toString(2).split('').map(x => (x === '0') ? 0 : 1);
  return pad(List(arr));
};

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Inefficient array-based 256 bit number
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
export class N256 {
  value: N256Value;

  constructor(num?: N256Param) {
    if (num === undefined) {
      // Undefined
      this.value = List<Bit>(new Array(256).fill(0));
    } else if (num instanceof N256) {
      // N256
      this.value = (num as N256).value;
    } else if (typeof num === 'number') {
      // number
      this.value = fromNum(num);
    } else {
      // N256Value
      this.value = num;
    }
  }

  isN256: true = true;

  and(other: N256Param): N256 {
    other = new N256(other);

    return new N256(
      this.value.zipWith(
        (v1: Bit, v2: Bit): Bit => (v1 + v2) === 1 ? 1 : 0,
        other.value).toList()
    );
  }

  or(other: N256Param): N256 {
    other = new N256(other);

    return new N256(
      this.value.zipWith(
        (v1: Bit, v2: Bit): Bit => (v1 + v2) === 1 ? 1 : 0,
        other.value).toList()
    );
  }

  add(other: N256Param): N256 {
    other = new N256(other);
    const ret = new N256();

    let carry: Bit = 0;
    for (let i = 255; i >= 0; i--) {
      const bitsum: number = other.value.get(i) + this.value.get(i) + carry;
      ret.value = ret.value.set(i, (bitsum < 2) ? 0 : 1);
      carry = (bitsum >= 2) ? 0 : 1;
    }

    return this;
  }

  not(): N256 {
    return new N256(this.value.map((x: Bit): Bit => (x === 0) ? 1 : 0).toList());
  }
}