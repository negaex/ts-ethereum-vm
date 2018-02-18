
import { expect, should } from 'chai';
should();
import 'mocha';

import { runCode } from './testUtil';

export function runVMTest (options: any, testData: any, log: boolean = false) {
  console.log(testData.exec);
  const state = runCode(testData.exec.code, testData.exec.data, log);
  (state.running).should.equal(false); 
}
