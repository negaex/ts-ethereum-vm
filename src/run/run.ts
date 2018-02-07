
import { instructions, OpCode } from '../instructions/instructions';
import { State } from '../state/state';
import { operations, Operation } from './operations';
import { step } from './step';
import { InvalidBinary } from '../errors';

export const run = (state: State): State => {

  while (state.hasCode() && state.get('running')) {
    const nextCode: number = state.nextCode();
    const nextOp: OpCode = instructions[nextCode];
    if (!nextOp) {
      throw new InvalidBinary(`Invalid op: ${nextCode}`);
    }
    state = step(state, nextOp);
    console.log(state);
  }

  return state;
};