
import { OpCode } from '../instructions/instructions';
import { MachineState as State } from '../state/machinestate';
import { operations, Operation, DynamicOp } from './operations';
import { VMError, highlight } from '../errors';

export function step(state: State, opcode: OpCode, log: boolean): State {
  const regex: RegExp = /([A-Z]+)([0-9]+)?/;
  const [_, opName, opParam]: string[] = regex.exec(opcode.mnemonic);
  let operation: Operation;
  if (opParam) {
    const dynamic: DynamicOp = (operations[opName] as DynamicOp);
    if (!dynamic) {
      throw new VMError(`Parameterd operation not implemented: //${opcode.mnemonic}\\ (0x${opcode.code.toString(16)})`);
    }
    operation = dynamic(parseInt(opParam, 10));
  } else {
    operation = (operations[opName] as Operation);
  }
  if (!operation) {
    throw new VMError(`Operation not implemented: //${opcode.mnemonic}\\ (0x${opcode.code.toString(16)})`);
  }

  if (log) {
    process.stdout.write(`\n${opcode.mnemonic}`);
  }

  state = state.setLogInfo(opcode.mnemonic);

  // Increment program counter
  state = state.incrementPC();

  // Increment gas usage
  state = state.useGas(opcode.gas);

  // Run operation
  state = operation(state);

  if (log) {
    console.log(`\r─ ${state.logInfo} ${'─'.repeat(Math.max(0, process.stdout.columns - 3 - state.logInfo.length))}`);
    console.log(state + '\n' + '─'.repeat(process.stdout.columns));

    if (!state.running) {
      console.log(highlight(`//RETURNED\\: <<${state.returnValue.toString('hex')}>>`));
    }
  }

  // Return new state
  return state;
}