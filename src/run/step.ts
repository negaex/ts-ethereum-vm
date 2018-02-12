
import { OpCode } from '../instructions/instructions';
import { State } from '../state/state';
import { operations, Operation, DynamicOp } from './operations';
import { VMError } from '../errors';

export const step = (state: State, opcode: OpCode, log: boolean): State => {
  const regex = /([A-Z]+)([0-9]+)?/;
  const [_, opName, opParam] = regex.exec(opcode.mnemonic);
  let operation: Operation;
  if (opParam) {
    operation = (operations[opName] as DynamicOp)(parseInt(opParam, 10));
  } else {
    operation = (operations[opName] as Operation);
  }
  if (!operation) {
    throw new VMError(`Operation not implemented: //${opcode.mnemonic}\\ (0x${opcode.code.toString(16)})`);
  }

  if (log) {
    console.log(`─ ${opcode.mnemonic} ${'\n─'.repeat(process.stdout.columns - 3 - opcode.mnemonic.length)}`);
  }

  // Increment program counter
  state = state.incrementPC();

  // Increment gas usage
  state = state.useGas(opcode.gas);

  // Run operation
  state = operation(state);

  if (log) {
    console.log(state + '\n' + '─'.repeat(process.stdout.columns));
  }

  // Return new state
  return state;
};