
import { run } from './run/run';
import { State } from './state/state';

const main = () => {
  const demo1 = '6001600081905550';
  const demo2 = '600080547002000000000000000000000000000000006001608060020a03199091166001176001608060020a0316179055';

  const binary = Buffer.from(demo1, 'hex');
  const initialState = new State().loadCode(binary);
  console.log(`Running code: ${binary.toString('hex')}`);
  console.log(`START => \t{${initialState}}`);
  run(initialState);
};

main();
