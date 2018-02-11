
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
// tslint:disable-next-line:max-line-length
main('60606040523415600e57600080fd5b5b60016000819055505b5b60368060266000396000f30060606040525b600080fd00a165627a7a72305820af3193f6fd31031a0e0d2de1ad2c27352b1ce081b4f3c92b5650ca4dd542bb770029');
