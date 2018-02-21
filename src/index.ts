// tslint:disable:max-line-length

// import { run } from './run/run';
// import { MachineState as State } from './state/machinestate';
// import * as fs from 'fs';
// import { runCode } from '../test/testUtil';

// // Replace with input from CLI
// fs.readFile('./test/erc20.bin', 'utf8', function(err: any, data: string) {
//   const program: Buffer = runCode(data, '', true).returnValue;
//   // if (program) {
//   //   const callData = Buffer.from('0xa9059cbb0000000000000000000000008F9Dd6055E19D54Bc2B864BcBdaad3A16EE42c7a0000000000000000000000000000000000000000000003A469F3467E8EC00000', 'hex');
//   //   main(program, callData, true);
//   // }
// });

import { Node } from './node/node';
import { Ox0, Ox1, N256 } from './lib/N256';
import { List } from 'immutable';
import { highlight } from './errors';

const node = new Node(Ox0);
node.newTransaction(
  Ox0,
  Ox0,
  new N256(0),
  '0x6060604052341561000f57600080fd5b60df8061001d6000396000f3006060604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063771602f714604e578063d46300fd146077575b600080fd5b3415605857600080fd5b60756004808035906020019091908035906020019091905050609d565b005b3415608157600080fd5b608760aa565b6040518082815260200191505060405180910390f35b8082016000819055505050565b600080549050905600a165627a7a72305820c2ef1b0affb848c9a8663865a61dba212eedef8a6719524319898906bfd4b22c0029',
);

// console.log(node.getAccounts().inner.keySeq().map(x => x.toBinary()));

node.newTransaction(
  Ox0,
  // tslint:disable-next-line:whitespace
  new N256(List([false,false,true,false,true,false,false,true,false,false,false,false,true,true,false,true,true,true,true,false,true,true,false,false,true,true,false,true,true,false,false,true,false,true,false,true,false,true,false,false,true,false,false,false,true,false,true,true,false,true,true,false,false,false,true,false,true,false,true,false,true,false,false,false,true,true,false,true,false,true,true,false,false,false,false,false,false,false,true,true,false,true,false,false,false,true,false,true,true,false,true,false,true,false,false,true,true,false,false,false,true,false,false,false,false,false,true,true,true,false,false,false,false,true,true,false,true,true,true,true,true,true,false,false,true,false,false,false, false, true, false, false, true, false, true, true, true, false, true, false, false, true, true, false, true, false, true, true, true, true, false, false, true, false, false, true, false, true, false, true, false, true, false, false, true, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, true, true, false, true, true, false, false, false, true, true, false, true, true, false, false, false, true, false, true, true, true, true, true, false, false, true, false, false, true, true, false, false, false, true, false, true, true, false, false, false, false, false, true, true, true, false, true, true, true, true, false, false, true, true, true, true, true, false, false, true, false, true, false, true, true, false, false, false, true, true])),
  new N256(0),
  '0x771602f700000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003',
);

console.log('\n\n' + highlight(node.getAccounts().toString()));