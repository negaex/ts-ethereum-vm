
import { List } from 'immutable';
import BigNumber from 'bignumber.js';

type N256Value = List<Bit>;
type N256Param = number | N256 | N256Value;
type Bit = 0 | 1;

const pad = (arr: N256Value): N256Value => {
  arr = arr.slice(Math.max(0, arr.size - 256)).toList();
  const diff = 256 - arr.size;
  return List(new Array(diff).fill(0)).push(...arr.toArray());
};

const fromNum = (bin: number): N256Value => {
  const arr = bin.toString(2).split('').map(x => (x === '0') ? 0 : 1);
  // console.log(arr);
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

  lessThan(other: N256Param): boolean {
    other = new N256(other);
    for (let i = 0; i < 256; i++) {
      if (this.value.get(i) > other.value.get(i)) {
        return false;
      } else if (this.value.get(i) < other.value.get(i)) {
        return true;
      }
    }
    return false;
  }

  and(other: N256Param): N256 {
    other = new N256(other);

    return new N256(
      this.value.zipWith(
        (v1: Bit, v2: Bit): Bit => (v1 + v2) === 2 ? 1 : 0,
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
      ret.value = ret.value.set(i, (bitsum % 2 === 1) ? 1 : 0);
      carry = (bitsum >= 2) ? 1 : 0;
    }

    return ret;
  }

  sub(other: N256Param): N256 {
    other = new N256(other);
    const ret = new N256();

    let carry: Bit = 0;
    for (let i = 255; i >= 0; i--) {
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

  shiftLeft(amount: number): N256 {
    return new N256(this.value.slice(amount).toList().push(...new Array(amount).fill(0)));
  }

  shiftRight(amount: number): N256 {
    return new N256(
      List<Bit>(new Array(amount).fill(0)).concat(this.value.slice(0, this.value.size - amount)).toList()
    );
  }

  mul(other: N256Param): N256 {
    let left = new N256(this);
    let right = new N256(other);
    let ret = new N256();

    for (let i = 255; i >= 0; i--) {
      if (right.value.get(255) === 1) {
        ret = ret.add(left);
      }
      right = right.shiftRight(1);
      left = left.shiftLeft(1);
    }

    return ret;
  }

  div(other: N256Param): N256 {
    let dividend = new N256(this);
    let divisor = new N256(other);
    let quotient = new N256();
    let remainder = new N256();

    let nBits = 256;
    let previousDividend = dividend;

    while (remainder.lessThan(divisor)) {
      const bit = dividend.value.get(0);
      console.log(dividend.toBinary());
      remainder = remainder.shiftLeft(1).or(bit);
      previousDividend = dividend;
      dividend = dividend.shiftLeft(1);
      console.log(dividend.toBinary());
      nBits--;
    }

    dividend = previousDividend;
    remainder = remainder.shiftRight(1);
    nBits++;

    console.log('\n');
    console.log(dividend.toBinary());
    console.log(remainder.toBinary());
    console.log('...');

    for (let i = 0; i < nBits; i++) {
      const bit = dividend.value.get(0);
      remainder = remainder.shiftLeft(1).or(bit);
      const t = remainder.sub(divisor);
      const q = t.value.get(0) === 0 ? 1 : 0;
      dividend = dividend.shiftLeft(1);
      quotient = (quotient.shiftLeft(1).or(q));
      if (q === 1) {
        remainder = t;
      }
      console.log(quotient.toBinary());
    }

    return quotient;
    // return new N256(new BigNumber(this.toString()).dividedToIntegerBy(other.toString()).toNumber());
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
    return this.value.join('').replace(/^0+/, '') || '0';
  }

  toNumber(): number {
    return parseInt(this.value.join(''), 2);
  }
}