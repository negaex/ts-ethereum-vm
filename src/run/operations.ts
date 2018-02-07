
import { State } from '../state/state';

export type Operation = (state: State) => State;

export const operations: { [opcode: string]: Operation } = {
  STOP: (state: State): State => {
    return state.stop();
  },

  ADD: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst + snd);
  },

  PUSH1: (state: State): State => {
    const value = state.nextCode();
    return state.pushStack(value).incrementPC();
  },

  DUP2: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(snd).pushStack(fst).pushStack(snd);
  },

  SWAP1: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst).pushStack(snd);
  },

  SSTORE: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.storeAt(snd, fst);
  },

  POP: (state: State): State => {
    return state.popStack().incrementPC();
  },

};