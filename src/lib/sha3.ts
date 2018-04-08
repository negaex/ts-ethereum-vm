
import { N256 } from './N256';
import { N8, fromN256 } from './N8';
const keccak: any = require('keccak');

export function sha3(n: N256 | Buffer): N256 {
  let buff: Buffer;
  if (!(n instanceof Buffer)) {
    const arr: number[] = fromN256(n).map((n8: N8) => n8.toNumber());
    buff = new Buffer(arr);
  } else {
    buff = n;
  }
  const digest: Buffer = keccak('keccak256').update(buff).digest();
  return new N256(digest);
}