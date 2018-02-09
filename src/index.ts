
import { run } from './run/run';
import { State } from './state/state';

const main = (input: string) => {
  const binary = Buffer.from(input, 'hex');
  const initialState = new State().loadCode(binary);
  console.log(`Running code: ${binary.toString('hex')}`);
  console.log(`START => \t{${initialState}}`);
  run(initialState);
};

// Replace with input from CLI
main('6001600081905550');
