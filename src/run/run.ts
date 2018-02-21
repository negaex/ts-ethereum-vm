
import { instructions, OpCode } from '../instructions/instructions';
import { MachineState } from '../state/machinestate';
import { operations, Operation } from './operations';
import { step } from './step';
import { InvalidBinary } from '../errors';

export const run = (state: MachineState, log: boolean = false): MachineState => {

  if (log) {
    console.log(`Running code: ${state.code.toString('hex')}`);
    console.log(`START => \t{${state}}`);
  }

  while (state.hasCode() && state.get('running')) {
    const nextCode: number = state.nextCode();
    const nextOp: OpCode = instructions[nextCode];
    if (!nextOp) {
      throw new InvalidBinary(`Invalid op: 0x${nextCode.toString(16)}`);
    }
    state = step(state, nextOp, log);
  }

  return state.stop();
};