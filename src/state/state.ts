import { Record } from '../lib/record';
import { Stack, emptyStack, stackToString } from './stack';
import { Storage, emptyStorage, storageToString } from './storage';
import { N256 } from '../lib/N256';

interface StateInterface {
  code: Buffer;
  programCounter: number;
  running: boolean;
  stack: Stack;
  storage: Storage;
  gasUsed: number;
}

export class State extends Record<StateInterface>({
  code: Buffer.from([]),
  programCounter: 0,
  running: true,
  stack: emptyStack,
  storage: emptyStorage,
  gasUsed: 0,
}) {

  // Code
  loadCode(code: Buffer): State {
    return this.set('code', code);
  }

  hasCode(): boolean {
    return this.programCounter < this.code.length;
  }

  nextCode(): number {
    return this.code[this.programCounter];
  }

  // Program counter
  incrementPC(amount: number = 1): State {
    return this.set('programCounter', this.programCounter + amount);
  }

  pc(): number {
    return this.get('programCounter');
  }

  setPC(pc: number): State {
    return this.set('programCounter', pc);
  }

  // Stack
  stackFirst(): N256 {
    return this.stack.first();
  }

  popStack(): State {
    return this.set('stack', this.stack.delete(0));
  }

  pushStack(value: N256): State {
    return this.set('stack', this.stack.insert(0, value));
  }

  // running status
  stop(): State {
    return this.set('running', false);
  }

  start(): State {
    return this.set('running', true);
  }

  // Storage
  storeAt(address: N256, value: N256): State {
    return this.set('storage', this.storage.set(address.toBinary(), value));
  }

  storedAt(address: N256): N256 {
    return this.get('storage').get(address.toBinary()) || new N256();
  }

  // Gas
  useGas(gas: number): State {
    return this.set('gasUsed', this.get('gasUsed') + gas);
  }

  /*
  programCounter: 0,
  running: true,
  stack: emptyStack,
  code: Buffer.from([]),
  storage: emptyStorage,
  */

  toString(): string {
    return `PC: ${this.programCounter}, running: ${this.running}, \
stack: ${stackToString(this.stack)}, storage: ${storageToString(this.storage)}, gasUsed: ${this.gasUsed}`;
  }
}