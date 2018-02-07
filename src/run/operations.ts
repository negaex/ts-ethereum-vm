
import { State } from '../state/state';
import { N256 } from '../lib/N256';

export type Operation = (state: State) => State;
export type DynamicOp = (param: number) => Operation;

export const operations: { [opcode: string]: Operation | DynamicOp } = {
  STOP: (state: State): State => {
    return state.stop();
  },

  ADD: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.add(snd));
  },

  SUB: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.sub(snd));
  },

  MUL: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.mul(snd));
  },

  DIV: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.div(snd));
  },

  EXP: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.exp(snd));
  },

  /* bitwise */
  AND: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.and(snd));
  },

  OR: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.or(snd));
  },

  NOT: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    return state.pushStack(fst.not());
  },

  SSTORE: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    const snd = state.stackFirst(); state = state.popStack();
    return state.storeAt(snd, fst);
  },

  SLOAD: (state: State): State => {
    const fst = state.stackFirst(); state = state.popStack();
    return state.pushStack(state.storedAt(fst));
  },

  POP: (state: State): State => {
    return state.popStack().incrementPC();
  },

  /* DYNAMIC */

  PUSH: (param: number) => (state: State): State => {
    // Todo: Don't do string manipulations
    let toPush = ``;
    for (let i = 0; i < param; i++) {
      toPush += state.nextCode().toString(16);
      state = state.incrementPC();
    }
    return state.pushStack(new N256(parseInt(toPush, 16)));
  },

  SWAP: (param: number) => (state: State): State => {
    const values = [];
    for (let i = 0; i < param; i++) {
      values.push(state.stackFirst()); state = state.popStack();
    }
    const tmp = values[param - 1];
    values[param - 1] = values[0];
    values[0] = tmp;
    for (let i = 0; i < param; i++) {
      state = state.pushStack(values[i]);
    }
    return state;
  },

  DUP: (param: number) => (state: State): State => {
    const values = [];
    for (let i = 0; i < param; i++) {
      values.push(state.stackFirst()); state = state.popStack();
    }
    state = state.pushStack(values[values.length - 1]);
    for (let i = 0; i < param; i++) {
      state = state.pushStack(values[i]);
    }
    return state;
  },

};