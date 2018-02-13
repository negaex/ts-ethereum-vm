// tslint:disable:max-line-length

import { run } from '../run/run';
import { State } from '../state/state';
import { expect, should } from 'chai';
should();
import 'mocha';
import { N256 } from '../lib/N256';

const runCode = (code: string, calldata: string, log: boolean = false): State => {
  const binary = Buffer.from(code, 'hex');
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
    const state = runCode('600035', '04', true);
    // state.returnValue.toString('hex').should.equal('60606040525b600080fd00a165627a7a723058209747525da0f525f1132dde30c8276ec70c4786d4b08a798eda3c8314bf796cc30029');
    // state.stack.toArray().length.should.equal(0);
    // state.storage.toArray().length.should.equal(0);
  });

});
