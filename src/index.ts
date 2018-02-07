
import { run } from './run/run';
import { State } from './state/state';

const main = () => {
  const binary = Buffer.from('6001600081905550', 'hex');
  const initialState = new State().loadCode(binary);
  console.log(initialState);
  run(initialState);
};

main();