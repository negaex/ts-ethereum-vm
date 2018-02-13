// tslint:disable:max-line-length

import { run } from './run/run';
import { State } from './state/state';

const main = (input: string) => {
  const binary = Buffer.from(input, 'hex');
  const initialState = new State().loadCode(binary);
  console.log(`Running code: ${binary.toString('hex')}`);
  console.log(`START => \t{${initialState}}`);
  run(initialState, true);
};

// Replace with input from CLI
// main('60606040523415600e57600080fd5b5b60016000819055505b5b60368060266000396000f30060606040525b600080fd00a165627a7a72305820af3193f6fd31031a0e0d2de1ad2c27352b1ce081b4f3c92b5650ca4dd542bb770029');
main('60606040523415600e57600080fd5b5b603680601c6000396000f30060606040525b600080fd00a165627a7a723058209747525da0f525f1132dde30c8276ec70c4786d4b08a798eda3c8314bf796cc30029')