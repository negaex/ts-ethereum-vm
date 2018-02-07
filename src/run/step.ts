
import { OpCode } from '../instructions/instructions';
import { State } from '../state/state';
import { operations, Operation, DynamicOp } from './operations';
import { VMError } from '../errors';

export const step = (state: State, opcode: OpCode): State => {
  const regex = /([A-Z]+)([0-9]+)?/;
  const [_, opName, opParam] = regex.exec(opcode.mnemonic);
  let operation: Operation;
  if (opParam) {
    operation = (operations[opName] as DynamicOp)(parseInt(opParam, 10));
  } else {
    operation = (operations[opName] as Operation);
  }
  if (!operation) {
    throw new VMError(`Operation not implemented: //${opcode.mnemonic}\\`);
  }
  // Increment program counter
  state = state.incrementPC();

  // Increment gas usage
  state = state.useGas(opcode.gas);

  // Run operation
  state = operation(state);

  console.log(`${opcode.mnemonic} ==> \t{${state}}`);

  // Return new state
  return state;
};