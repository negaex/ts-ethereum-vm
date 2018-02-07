
import { List } from 'immutable';
import BigNumber from 'bignumber.js';

type N256Value = List<Bit>;
type N256Param = number | N256 | N256Value;
type Bit = 0 | 1;

const pad = (arr: N256Value): N256Value => {
  const diff = 256 - arr.size;
  return List(new Array(diff).fill(0)).push(...arr.toArray());
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

  greaterThan(other: N256Param): boolean {
    other = new N256(other);
    for (let i = 0; i < 256; i++) {
      if (this.value.get(i) > other.value.get(i)) {
        return true;
      } else if (this.value.get(i) < other.value.get(i)) {
        return false;
      }
    }
    return false;
  }

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

  sub(other: N256Param): N256 {
    other = new N256(other);
    const ret = new N256();

    let carry: Bit = 0;
    for (let i = 255; i >= 0; i--) {
      // const bitsum: number = other.value.get(i) + this.value.get(i) + carry;
      const bitsum: number = other.value.get(i) + carry;
      if (this.value.get(i) === 0) {
        ret.value = ret.value.set(i, (bitsum === 1) ? 1 : 0);
        carry = (bitsum >= 1) ? 1 : 0;
      } else {
        ret.value = ret.value.set(i, (bitsum === 1) ? 0 : 1);
        carry = (bitsum >= 2) ? 1 : 0;
      }
    }

    return ret;
  }

  mul(other: N256Param): N256 {
    console.error('Multiplication implemented yet!');
    other = new N256(other);
    return new N256(new BigNumber(this.toString()).times(other.toString()).toNumber());
  }

  div(other: N256Param): N256 {
    console.error('Division implemented yet!');
    other = new N256(other);
    return new N256(new BigNumber(this.toString()).dividedToIntegerBy(other.toString()).toNumber());
  }

  exp(other: N256Param): N256 {
    console.error('Exponentiation implemented yet!');
    other = new N256(other);
    return new N256(new BigNumber(this.toString()).pow(new BigNumber(other.toString()).toNumber()).toNumber());
  }

  not(): N256 {
    return new N256(this.value.map((x: Bit): Bit => (x === 0) ? 1 : 0).toList());
  }

  toString(): string {
    return parseInt(this.value.join(''), 2).toString();
  }

  toBinary(): string {
    return this.value.join('');
  }
}