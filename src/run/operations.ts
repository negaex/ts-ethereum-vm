
import { State } from '../state/state';
import { N256 } from '../lib/N256';
import { N8 } from '../lib/N8';

export type Operation = (state: State) => State;
export type DynamicOp = (param: number) => Operation;

export const operations: { [opcode: string]: Operation | DynamicOp } = {
  STOP: (state: State): State => {
    return state.stop();
  },

  ADD: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.add(snd));
  },

  SUB: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.sub(snd));
  },

  MUL: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.mul(snd));
  },

  DIV: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.div(snd));
  },

  EXP: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.exp(snd));
  },

  /* bitwise */
  AND: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.and(snd));
  },

  OR: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.or(snd));
  },

  NOT: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(fst.not());
  },

  SSTORE: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.storeAt(fst, snd);
  },

  SLOAD: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(state.storedAt(fst));
  },

  MSTORE: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.setMemoryAt(fst, snd);
  },

  MLOAD: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(state.getMemoryAt(fst));
  },

  CALLVALUE: (state: State): State => {
    // TODO!!!
    return state.pushStack(new N256(0));
  },

  ISZERO: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(fst.isZero() ? new N256(0) : new N256(1)); 
  },

  JUMPI: (state: State): State => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    if (snd.isZero()) {
      state = state.set('programCounter', fst.toNumber());
    }
    return state;
  },

  JUMPDEST: (state: State): State => {
    // TODO!!! - Mark as a valid jump destination
    return state;
  },

  CODECOPY: (state: State): State => {
    // TODO!!!

    let memOffset; [memOffset, state] = state.popStack();
    let codeOffset; [codeOffset, state] = state.popStack();
    let length; [length, state] = state.popStack();

    for (let i = new N256(0); i.lessThanOrEqual(length); i = i.add(1)) {
      state = state.setMemoryByteAt(memOffset, new N8(state.code[codeOffset.toNumber()]));
      memOffset = memOffset.add(1);
      codeOffset = codeOffset.add(1);
    }

    return state;
  },

  RETURN: (state: State): State => {
    // TODO
    return state.stop();
  },

  POP: (state: State): State => {
    [, state] = state.popStack();
    return state;
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
    for (let i = 0; i < param + 1; i++) {
      let fst; [fst, state] = state.popStack();
      values.push(fst);
    }
    const tmp = values[param];
    values[param] = values[0];
    values[0] = tmp;
    for (let i = param; i >= 0; i--) {
      state = state.pushStack(values[i]);
    }
    return state;
  },

  DUP: (param: number) => (state: State): State => {
    const values = [];
    for (let i = 0; i < param; i++) {
      let fst; [fst, state] = state.popStack();
      values.push(fst);
    }
    for (let i = param - 1; i >= 0; i--) {
      state = state.pushStack(values[i]);
    }
    state = state.pushStack(values[values.length - 1]);
    return state;
  },

};
