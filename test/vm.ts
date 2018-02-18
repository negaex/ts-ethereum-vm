// tslint:disable:max-line-length

import { expect, should } from 'chai';
should();
import 'mocha';
import { N256, Ox0 } from '../src/lib/N256';
import { runCode } from './testUtil';

describe('VM', () => {

  it('can store a value to storage', () => {
    runCode('60606040523415600e57600080fd5b5b60016000819055505b5b60368060266000396000f30060606040525b600080fd00a165627a7a72305820af3193f6fd31031a0e0d2de1ad2c27352b1ce081b4f3c92b5650ca4dd542bb770029', '', false);
  });

  it('can store two 128 bit values at a single storage location', () => {
    const state = runCode('600080547002000000000000000000000000000000006001608060020a03199091166001176001608060020a0316179055', '', false);
    state.storedAt(Ox0).toBinary().should.equal(new N256(1).shiftLeft(65).add(1).toBinary());
  });

  it('can return a program', () => {
    const state = runCode('60606040523415600e57600080fd5b5b603680601c6000396000f30060606040525b600080fd00a165627a7a723058209747525da0f525f1132dde30c8276ec70c4786d4b08a798eda3c8314bf796cc30029', '', false);
    state.returnValue.toString('hex').should.equal('60606040525b600080fd00a165627a7a723058209747525da0f525f1132dde30c8276ec70c4786d4b08a798eda3c8314bf796cc30029');
    state.stack.toArray().length.should.equal(0);
    // state.storage.toArray().length.should.equal(0);
  });

  // it('can run a program with auxdata at the end of it', () => {
  //   const state = runCode('60606040525b600080fd00a165627a7a723058209747525da0f525f1132dde30c8276ec70c4786d4b08a798eda3c8314bf796cc30029', true);
  // });

  // it('can run a complex contract', () => {
  //   const state = runCode('...', true);
  // });

});
