
import { List } from 'immutable';
import { N8, fromN256 } from './N8';

export type Bit = boolean;
export type BitList = List<Bit>;
type N256Param = number | N256 | BitList | Buffer | string;

export function pad(arr: BitList, length: number): BitList {
  arr = arr.slice(Math.max(0, arr.size - length)).toList();
  const diff: number = length - arr.size;
  return List(new Array(diff).fill(false)).push(...arr.toArray());
}

export function padRight(arr: BitList, length: number): BitList {
  arr = arr.slice(Math.max(0, arr.size - length)).toList();
  const diff: number = length - arr.size;
  return arr.concat(List(new Array(diff).fill(false))).toList();
}

export function fromString(bin: string, length: number): BitList {
  const arr: boolean[] = bin.split('').map((x: string) => (x === '1'));
  // console.log(arr);
  return pad(List(arr), length);
}

export function fromNum(bin: number, length: number): BitList {
  return fromString(bin.toString(2), length);
}

export function fromBuffer(buff: Buffer, rightPadding: boolean = false): BitList {
  let arr: List<Bit> = List<Bit>();
  for (let i: number = 0; i < buff.length; i++) {
    arr = arr.concat(new N8(buff[i]).value).toList();
    // arr = List<N8>([new N8(buff[i])]).concat(arr).toList();
  }
  if (rightPadding) {
    return padRight(arr, 256);
  }
  return pad(arr, 256);
}

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Inefficient array-based 256 bit number
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * 
 * TODO: Use an immutable record
 */
export class N256 {
  value: BitList;

  constructor(num?: N256Param) {
    if (num === undefined) {
      // Undefined
      this.value = List<Bit>(new Array(256).fill(false));
    } else if (num instanceof N256) {
      // N256
      this.value = (num as N256).value;
    } else if (typeof num === 'number') {
      // number
      if (num < 0) {
        this.value = new N256(-num).not().add(1).value;
      } else {
        this.value = fromNum(num, 256);
      }
    } else if (num instanceof Buffer) {
      this.value = fromBuffer(num);
    } else if (typeof num === 'string') {
      this.value = fromString(num, 256);
    } else {
      // N256Value
      this.value = pad(num, 256);
    }
  }

  greaterThan(other: N256Param): boolean {
    other = new N256(other);
    for (let i: number = 0; i < 256; i++) {
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
    for (let i: number = 0; i < 256; i++) {
      if (this.value.get(i) > other.value.get(i)) {
        return false;
      } else if (this.value.get(i) < other.value.get(i)) {
        return true;
      }
    }
    return false;
  }

  lessThanOrEqual(other: N256Param): boolean {
    return !this.greaterThan(other);
  }

  greatherThanOrEqual(other: N256Param): boolean {
    return !this.lessThan(other);
  }

  equals(other: N256Param): boolean {
    other = new N256(other);
    return this.value.zip(other.value).reduce((acc: boolean, [l, r]: [Bit, Bit]) => acc && (l === r), true);
  }

  isZero(): boolean {
    return this.equals(0);
  }

  // Negatives
  signedLessThan(other: N256Param): boolean {
    other = new N256(other);
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.greaterThan(other);
      } else {
        return true;
      }
    } else {
      if (other.isNegative()) {
        return false;
      } else {
        return this.lessThan(other);
      }
    }
  }

  signedGreaterThan(other: N256Param): boolean {
    other = new N256(other);
    return !(this.signedGreaterThan(other) || this.equals(other));
  }

  and(other: N256Param): N256 {
    other = new N256(other);

    return new N256(
      this.value.zipWith(
        (v1: Bit, v2: Bit): Bit => (v1 && v2),
        other.value).toList()
    );
  }

  or(other: N256Param): N256 {
    other = new N256(other);

    return new N256(
      this.value.zipWith(
        (v1: Bit, v2: Bit): Bit => (v1 || v2),
        other.value).toList()
    );
  }

  add(other: N256Param): N256 {
    other = new N256(other);
    const ret: N256 = new N256();

    let carry: number = 0;
    for (let i: number = 255; i >= 0; i--) {
      const bitsum: number = (other.value.get(i) ? 1 : 0) +
        (this.value.get(i) ? 1 : 0) +
        carry;
      ret.value = ret.value.set(i, (bitsum % 2 === 1));
      carry = (bitsum >= 2) ? 1 : 0;
    }

    return ret;
  }

  sub(other: N256Param): N256 {
    // Is add(other.not()) any slower?

    other = new N256(other);
    const ret: N256 = new N256();

    let carry: number = 0;
    for (let i: number = 255; i >= 0; i--) {
      const bitsum: number = (other.value.get(i) ? 1 : 0) + carry;
      if (!this.value.get(i)) {
        ret.value = ret.value.set(i, (bitsum === 1));
        carry = (bitsum >= 1) ? 1 : 0;
      } else {
        ret.value = ret.value.set(i, !(bitsum === 1));
        carry = (bitsum >= 2) ? 1 : 0;
      }
    }

    return ret;
  }

  shiftLeft(amount: number): N256 {
    return new N256(this.value.slice(amount).toList().push(...new Array(amount).fill(false)));
  }

  shiftRight(amount: number): N256 {
    return new N256(
      List<Bit>(new Array(amount).fill(false)).concat(this.value.slice(0, this.value.size - amount)).toList()
    );
  }

  mul(other: N256Param): N256 {
    let right: N256 = new N256(other);
    let ret: N256 = new N256();

    for (let i: number = 255; i >= 0; i--) {
      if (this.value.get(i)) {
        ret = ret.add(right);
      }
      right = right.shiftLeft(1);
    }

    return ret;
  }

  div(other: N256Param): N256 {
    let dividend: N256 = new N256(this);
    let denom: N256 = new N256(other); // divisor
    let current: N256 = Ox1;
    let answer: N256 = Ox0;

    if (denom.isZero()) {
      return Ox0;
    }

    const limit: N256 = Ox0.not().shiftRight(1);
    let overflowed: boolean = false;
    while (denom.lessThanOrEqual(dividend)) {
      if (denom.greatherThanOrEqual(limit)) {
        overflowed = true;
        break;
      }
      denom = denom.shiftLeft(1);
      current = current.shiftLeft(1);
    }

    if (!overflowed) {
      denom = denom.shiftRight(1);
      current = current.shiftRight(1);
    }

    while (!current.isZero()) {
      if (dividend.greatherThanOrEqual(denom)) {
        dividend = dividend.sub(denom);
        answer = answer.or(current);
      }
      current = current.shiftRight(1);
      denom = denom.shiftRight(1);
    }

    return answer;
  }

  sdiv(other: N256Param): N256 {
    other = new N256(other);
    if (other.isZero()) {
      return other;
    }
    if (other.equals(Ox1.shiftLeft(255).toNegative()) && this.equals(Ox1.toNegative())) {
      return Ox1.shiftLeft(255).toNegative();
    }
    let ret: N256 = this.abs().div(other.abs());
    if (this.isNegative()) {
      ret = ret.toNegative();
    }
    return ret;
  }

  exp(other: N256Param): N256 {
    other = new N256(other);
    if (other.isZero()) {
      return Ox1;
    } else if (other.equals(1)) {
      return this;
    } else if (!other.value.get(255)) {
      return this.mul(this).exp(other.div(2));
    } else if (other.value.get(255)) {
      return this.mul(this.mul(this).exp(other.sub(1).div(2)));
    }
  }

  mod(other: N256Param): N256 {
    return this.sub(this.div(other).mul(other));
  }

  smod(other: N256Param): N256 {
    other = new N256(other);
    if (other.isZero()) {
      return other;
    }
    let ret: N256 = this.abs().mod(other.abs());
    if (this.isNegative()) {
      ret = ret.toNegative();
    }
    return ret;
  }

  abs(): N256 {
    if (this.isNegative()) {
      return this.sub(1).not();
    } else {
      return this;
    }
  }

  isNegative(): boolean {
    return this.value.get(0);
  }

  toNegative(): N256 {
    return this.not().add(1);
  }

  not(): N256 {
    return new N256(this.value.map((bit: Bit): Bit => !bit).toList());
  }

  toString(): string {
    return parseInt(this.value.map((x: boolean) => x ? 1 : 0).join(''), 2).toString();
  }

  toBinary(): string {
    return this.value.map((x: boolean) => x ? 1 : 0).join('').replace(/^0+/, '') || '0';
  }

  toNumber(): number {
    return parseInt(this.value.map((x: boolean) => x ? 1 : 0).join(''), 2);
  }

  toSignedNumber(): number {
    if (this.isNegative()) {
      return -1 * this.abs().toNumber();
    } else {
      return this.toNumber();
    }
  }

  toHex(): string {
    let n8s: N8[] = fromN256(this);
    return '0x' + n8s.map((x: N8) => x.toHex()).join('');
  }
}

export const Ox0: N256 = new N256(0);
export const Ox1: N256 = new N256(1);
export const Ox2: N256 = new N256(2);
export const Ox3: N256 = new N256(3);