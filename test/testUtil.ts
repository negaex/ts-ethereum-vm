
import { assemble } from '../src/assembler/assembler';
import { run } from '../src/run/run';
import { State } from '../src/state/state';

export const runCode = (code: string, calldata: string, log: boolean = false): State => {
    const binary = assemble(code);
    const binaryData = Buffer.from(calldata, 'hex');
    const initialState = new State().loadCode(binary).setCallData(binaryData);
    if (log) {
      console.log(`Running code: ${binary.toString('hex')}`);
      console.log(`START => \t{${initialState}}`);
    }
    return run(initialState, log);
  };
  