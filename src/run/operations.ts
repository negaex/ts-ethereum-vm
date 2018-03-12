
import { MachineState } from '../state/machinestate';
import { N256, fromBuffer, Ox0, Ox1 } from '../lib/N256';
import { N8 } from '../lib/N8';
const keccak: any = require('keccak');

export type Operation = (state: MachineState) => MachineState;
export type DynamicOp = (param: number) => Operation;

export const operations: { [opcode: string]: Operation | DynamicOp } = {
  STOP: (state: MachineState): MachineState => {
    return state.stop();
  },

  ADD: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.add(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SUB: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.sub(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  MUL: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.mul(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  DIV: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.div(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  EXP: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.exp(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  MOD: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.mod(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  ADDMOD: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    let tri: N256; [tri, state] = state.popStack();
    return state.pushStack(fst.add(snd).mod(tri))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()}, ${tri.toNumber()})`);
  },

  SDIV: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.sdiv(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SMOD: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.smod(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },
  
  /* bitwise */
  AND: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.and(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  OR: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.or(snd))
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  NOT: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    return state.pushStack(fst.not())
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  /* comparisons */
  EQ: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.equals(snd) ? Ox1 : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  LT: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.lessThan(snd) ? Ox1 : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SLT: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.signedLessThan(snd) ? Ox1 : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  GT: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.greaterThan(snd) ? Ox1 : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SGT: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.pushStack(fst.signedGreaterThan(snd) ? Ox1 : Ox0)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SSTORE: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.storeAt(fst, snd)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  SLOAD: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    return state.pushStack(state.storedAt(fst))
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  MSTORE: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    return state.setMemoryAt(fst, snd)
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  MLOAD: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    return state.pushStack(state.getMemoryAt(fst))
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  CALLDATASIZE: (state: MachineState): MachineState => {
    return state.pushStack(new N256(state.callData.length));
  },

  CALLDATALOAD: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    const data: Buffer = state.callData.slice(fst.toNumber(), fst.add(32).toNumber());
    return state.pushStack(new N256(fromBuffer(data, true)));
  },

  CALLVALUE: (state: MachineState): MachineState => {
    // TODO!!!
    return state.pushStack(Ox0);
  },

  ISZERO: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    return state.pushStack(fst.isZero() ? Ox1 : Ox0)
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  JUMP: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    state = state.set('programCounter', fst.toNumber());
    return state
    .appendLogInfo(`(${fst.toNumber()})`);
  },

  JUMPI: (state: MachineState): MachineState => {
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    if (!snd.isZero()) {
      state = state.set('programCounter', fst.toNumber());
    }
    return state
    .appendLogInfo(`(${fst.toNumber()}, ${snd.toNumber()})`);
  },

  JUMPDEST: (state: MachineState): MachineState => {
    // TODO!!! - Mark as a valid jump destination
    return state;
  },

  CODECOPY: (state: MachineState): MachineState => {
    // TODO!!!

    let memOffset: N256; [memOffset, state] = state.popStack();
    let codeOffset: N256; [codeOffset, state] = state.popStack();
    let length: N256; [length, state] = state.popStack();
    
    state = state.appendLogInfo(`(\
${memOffset}, \
${codeOffset}, \
${length}): \
${state.code.slice(codeOffset.toNumber(), codeOffset.add(length).toNumber()).toString('hex')}`);

    for (let i: N256 = Ox0; i.lessThanOrEqual(length); i = i.add(1)) {
      state = state.setMemoryByteAt(memOffset, new N8(state.code[codeOffset.toNumber()]));
      memOffset = memOffset.add(1);
      codeOffset = codeOffset.add(1);
    }

    return state;
  },

  RETURN: (state: MachineState): MachineState => {
    // TODO
    let fst: N256; [fst, state] = state.popStack();
    let snd: N256; [snd, state] = state.popStack();
    const mem: Buffer = state.getMemoryAsBuffer(fst, snd);
    return state.stop().setReturnValue(mem)
    .appendLogInfo(`(${mem.toString('hex')})`);
  },

  POP: (state: MachineState): MachineState => {
    [, state] = state.popStack();
    return state.appendLogInfo('()');
  },

  CALLER: (state: MachineState): MachineState => {
    return state.pushStack(state.caller);
  },

  ADDRESS: (state: MachineState): MachineState => {
    return state.pushStack(state.address);
  },

  TIMESTAMP: (state: MachineState): MachineState => {
    return state.pushStack(state.currentBlock.timestamp);
  },

  NUMBER: (state: MachineState): MachineState => {
    return state.pushStack(state.currentBlock.number);
  },

  COINBASE: (state: MachineState): MachineState => {
    return state.pushStack(state.currentBlock.beneficiary);
  },

  BLOCKHASH: (state: MachineState): MachineState => {
    return state.pushStack(state.currentBlock.parentHash);
  },

  DIFFICULTY: (state: MachineState): MachineState => {
    return state.pushStack(state.currentBlock.difficulty);
  },

  GASLIMIT: (state: MachineState): MachineState => {
    return state.pushStack(state.currentBlock.gasLimit);
  },

  /* DYNAMIC */

  PUSH: (param: number): Operation => (state: MachineState): MachineState => {
    // Todo: Don't do string manipulations
    let toPush: string = ``;
    for (let i: number = 0; i < param; i++) {
      let byte: string = state.nextCode().toString(16);
      if (byte.length === 1) {
        byte = '0' + byte;
      }
      toPush += byte;
      state = state.incrementPC();
    }
    const n256: N256 = new N256(parseInt(toPush, 16));
    return state.pushStack(n256)
    .appendLogInfo(`(${n256.toNumber()})`);
  },

  SWAP: (param: number): Operation => (state: MachineState): MachineState => {
    const values: N256[] = [];
    for (let i: number = 0; i < param + 1; i++) {
      let fst: N256; [fst, state] = state.popStack();
      values.push(fst);
    }
    const tmp: N256 = values[param];
    values[param] = values[0];
    values[0] = tmp;
    for (let i: number = param; i >= 0; i--) {
      state = state.pushStack(values[i]);
    }
    return state
    .appendLogInfo(`(${values[param]}, ${values[0]})`);
  },

  DUP: (param: number): Operation => (state: MachineState): MachineState => {
    const values: N256[] = [];
    for (let i: number = 0; i < param; i++) {
      let fst: N256; [fst, state] = state.popStack();
      values.push(fst);
    }
    for (let i: number = param - 1; i >= 0; i--) {
      state = state.pushStack(values[i]);
    }
    state = state.pushStack(values[values.length - 1]);
    return state
    .appendLogInfo(`(${values[values.length - 1]})`);
  },

  SHA: (param: number): Operation => (state: MachineState): MachineState => {
    switch (param) {
      case 3:
        let fst: N256; [fst, state] = state.popStack();
        let snd: N256; [snd, state] = state.popStack();
        const mem: Buffer = state.getMemoryAsBuffer(fst, snd);
        const sha3: Buffer = keccak('keccak256').update(mem).digest();
        const n256: N256 = new N256(sha3);
        return state.pushStack(n256);
      default:
        throw '...';
    }
  }

};
