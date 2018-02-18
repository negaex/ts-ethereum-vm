// tslint:disable:max-line-length

import { run } from './run/run';
import { MachineState as State } from './state/machinestate';
import * as fs from 'fs';
import { runCode } from '../test/testUtil';

// Replace with input from CLI
fs.readFile('./test/erc20.bin', 'utf8', function(err: any, data: string) {
  const program: Buffer = runCode(data, '', true).returnValue;
  // if (program) {
  //   const callData = Buffer.from('0xa9059cbb0000000000000000000000008F9Dd6055E19D54Bc2B864BcBdaad3A16EE42c7a0000000000000000000000000000000000000000000003A469F3467E8EC00000', 'hex');
  //   main(program, callData, true);
  // }
});
