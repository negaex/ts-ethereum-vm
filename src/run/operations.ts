
import { VMState } from '../state/state';
import { N256, fromBuffer, Ox0 } from '../lib/N256';
import { N8 } from '../lib/N8';
const keccak = require('keccak');

export type Operation = (state: VMState) => VMState;
export type DynamicOp = (param: number) => Operation;

export const operations: { [opcode: string]: Operation | DynamicOp } = {
  STOP: (state: VMState): VMState => {
    return state.stop();
  },

  ADD: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.add(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SUB: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.sub(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  MUL: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.mul(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  DIV: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.div(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  EXP: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.exp(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  MOD: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.mod(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  ADDMOD: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    let tri; [tri, state] = state.popStack();
    return state.pushStack(fst.add(snd).mod(tri))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()}, ${tri.toNumber()})`);
  },

  SDIV: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.sdiv(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SMOD: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.smod(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },
  
  /* bitwise */
  AND: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.and(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  OR: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.or(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  NOT: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(fst.not())
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  /* comparisons */
  EQ: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.equals(snd) ? new N256(1) : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  LT: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.lessThan(snd) ? new N256(1) : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SLT: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.signedLessThan(snd) ? new N256(1) : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  GT: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.greaterThan(snd) ? new N256(1) : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SGT: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.pushStack(fst.signedGreaterThan(snd) ? new N256(1) : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SSTORE: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.storeAt(fst, snd)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SLOAD: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(state.storedAt(fst))
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  MSTORE: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    return state.setMemoryAt(fst, snd)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  MLOAD: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(state.getMemoryAt(fst))
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  CALLDATASIZE: (state: VMState): VMState => {
    return state.pushStack(new N256(state.getCallData().length));
  },

  CALLDATALOAD: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    const data = state.getCallData().slice(fst.toNumber(), fst.add(32).toNumber());
    return state.pushStack(new N256(fromBuffer(data, true)));
  },

  CALLVALUE: (state: VMState): VMState => {
    // TODO!!!
    return state.pushStack(Ox0);
  },

  ISZERO: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    return state.pushStack(fst.isZero() ? Ox0 : new N256(1))
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  JUMPI: (state: VMState): VMState => {
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    if (snd.isZero()) {
      state = state.set('programCounter', fst.toNumber());
    }
    return state
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  JUMPDEST: (state: VMState): VMState => {
    // TODO!!! - Mark as a valid jump destination
    return state;
  },

  CODECOPY: (state: VMState): VMState => {
    // TODO!!!

    let memOffset; [memOffset, state] = state.popStack();
    let codeOffset; [codeOffset, state] = state.popStack();
    let length; [length, state] = state.popStack();
    
    state = state.appendLogInfo(`(\
${memOffset}, \
${codeOffset}, \
${length}): \
${state.code.slice(codeOffset.toNumber(), codeOffset.add(length).toNumber()).toString('hex')}`);

    for (let i = Ox0; i.lessThanOrEqual(length); i = i.add(1)) {
      state = state.setMemoryByteAt(memOffset, new N8(state.code[codeOffset.toNumber()]));
      memOffset = memOffset.add(1);
      codeOffset = codeOffset.add(1);
    }

    return state;
  },

  RETURN: (state: VMState): VMState => {
    // TODO
    let fst; [fst, state] = state.popStack();
    let snd; [snd, state] = state.popStack();
    const mem = state.getMemoryAsBuffer(fst, snd);
    return state.stop().setReturnValue(mem)
    .appendLogInfo(`(${mem.toString('hex')})`);
  },

  POP: (state: VMState): VMState => {
    [, state] = state.popStack();
    return state.appendLogInfo('()');
  },

  CALLER: (state: VMState): VMState => {
    return state.pushStack(state.caller);
  },

  ADDRESS: (state: VMState): VMState => {
    return state.pushStack(state.address);
  },

  TIMESTAMP: (state: VMState): VMState => {
    return state.pushStack(state.getTimestamp());
  },

  NUMBER: (state: VMState): VMState => {
    return state.pushStack(state.getBlockNumber());
  },

  COINBASE: (state: VMState): VMState => {
    return state.pushStack(state.getCoinbase());
  },

  BLOCKHASH: (state: VMState): VMState => {
    return state.pushStack(state.getBlockhash());
  },

  DIFFICULTY: (state: VMState): VMState => {
    return state.pushStack(state.getDifficulty());
  },

  GASLIMIT: (state: VMState): VMState => {
    return state.pushStack(state.getGasLimit());
  },

  /* DYNAMIC */

  PUSH: (param: number) => (state: VMState): VMState => {
    // Todo: Don't do string manipulations
    let toPush = ``;
    for (let i = 0; i < param; i++) {
      toPush += state.nextCode().toString(16);
      state = state.incrementPC();
    }
    const n256 = new N256(parseInt(toPush, 16));
    return state.pushStack(n256)
    .appendLogInfo(`(${n256.toNumber()})`);
  },

  SWAP: (param: number) => (state: VMState): VMState => {
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
    return state
    .appendLogInfo(`(${values[param]}, ${values[0]})`);
  },

  DUP: (param: number) => (state: VMState): VMState => {
    const values = [];
    for (let i = 0; i < param; i++) {
      let fst; [fst, state] = state.popStack();
      values.push(fst);
    }
    for (let i = param - 1; i >= 0; i--) {
      state = state.pushStack(values[i]);
    }
    state = state.pushStack(values[values.length - 1]);
    return state
    .appendLogInfo(`(${values[values.length - 1]})`);
  },

  SHA: (param: number) => (state: VMState): VMState => {
    switch (param) {
      case 3:
        let fst; [fst, state] = state.popStack();
        let snd; [snd, state] = state.popStack();
        const mem: Buffer = state.getMemoryAsBuffer(fst, snd);
        const sha3: Buffer = keccak('keccak256').update(mem).digest();
        const n256 = new N256(sha3);
        return state.pushStack(n256);
      default:
        throw '...';
    }
  }

};
