// tslint:disable:max-line-length

import { run } from '../run/run';
import { State } from '../state/state';
import { expect, should } from 'chai';
should();
import 'mocha';
import { N256 } from '../lib/N256';

const runCode = (code: string, calldata: string, log: boolean = false): State => {
  const binary = Buffer.from(code.replace(/\s/g, ''), 'hex');
  const binaryData = Buffer.from(calldata, 'hex');
  const initialState = new State().loadCode(binary).setCallData(binaryData);
  if (log) {
    console.log(`Running code: ${binary.toString('hex')}`);
    console.log(`START => \t{${initialState}}`);
  }
  return run(initialState, log);
};

describe('OpCodes: ', () => {

  it('CALLDATALOAD', () => {
    const state = runCode('6000356000 52 60016000F3', '04');
    state.returnValue.toString('hex').should.equal('04');
  });

});
