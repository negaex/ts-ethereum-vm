
import { OpCode } from '../instructions/instructions';
import { State } from '../state/state';
import { operations, Operation } from './operations';
import { VMError } from '../errors';

export const step = (state: State, opcode: OpCode): State => {
  const operation: Operation = operations[opcode.mnemonic];
  if (!operation) {
    throw new VMError(`Operation not implemented: //${opcode.mnemonic}\\`);
  }
  console.log(opcode.mnemonic);
  state = operation(state.incrementPC());
  return state;
};