
import { N256 } from './N256';
import { N8, fromN256 } from './N8';
const keccak: any = require('keccak');

export function sha3(n: N256): N256 {
  const arr: number[] = fromN256(n).map((n8: N8) => n8.toNumber());
  const buff: Buffer = new Buffer(arr);
  const digest: Buffer = keccak('keccak256').update(buff).digest();
  return new N256(digest);
}