
import { N256 } from './N256';
import { fromN256 } from './N8';
const keccak = require('keccak');

export function sha3(n: N256): N256 {
  const arr = fromN256(n).map(n8 => n8.toNumber());
  const buff = new Buffer(arr);
  const digest: Buffer = keccak('keccak256').update(buff).digest();
  return new N256(digest);
}