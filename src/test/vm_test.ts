// tslint:disable:max-line-length

import { run } from '../run/run';
import { State } from '../state/state';
import { expect, should } from 'chai';
should();
import 'mocha';

const runCode = (code: string, log: boolean): State => {
  const binary = Buffer.from(code, 'hex');
  const initialState = new State().loadCode(binary);
  if (log) {
    console.log(`Running code: ${binary.toString('hex')}`);
    console.log(`START => \t{${initialState}}`);
  }
  return run(initialState, log);
};

describe('VM', () => {

  it('can store a value to storage', () => {
    runCode('60606040523415600e57600080fd5b5b60016000819055505b5b60368060266000396000f30060606040525b600080fd00a165627a7a72305820af3193f6fd31031a0e0d2de1ad2c27352b1ce081b4f3c92b5650ca4dd542bb770029', false);
  });

  it('can store two 128 bit values at a single storage location', () => {
    runCode('600080547002000000000000000000000000000000006001608060020a03199091166001176001608060020a0316179055', false);
  });

  // it('can store two 128 bit values at a single storage location', () => {
  //   runCode('600080547002000000000000000000000000000000006001608060020a03199091166001176001608060020a0316179055', false);
  // });

});
