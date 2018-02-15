// tslint:disable:max-line-length

import { run } from './run/run';
import { State } from './state/state';
import * as fs from 'fs';

const main = (input: string | Buffer, callData: Buffer, log: boolean = true): State => {
  if (typeof input === 'string') {
    input = Buffer.from(input, 'hex');
  }
  const initialState = new State().loadCode(input).setCallData(callData);
  console.log(`Running code: ${input.toString('hex')}`);
  console.log(`START => \t{${initialState}}`);
  return run(initialState, log);
};

// Replace with input from CLI
fs.readFile('./test/erc20.bin', 'utf8', function(err: any, data: string) {
  console.log(`Err: ${err}`);
  console.log(`Data: ${data}`);
  const program: Buffer = main(data, null, false).returnValue;
  const callData = Buffer.from('0xa9059cbb000000000000000000000000d2feed64d23115162723f1bbd97770190a1f4ffb0000000000000000000000000000000000000000000001d234f9a33f47600000', 'hex');
  main(program, callData, true);
});
