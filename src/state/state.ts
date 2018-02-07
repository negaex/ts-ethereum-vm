import { Record } from '../lib/record';
import { Stack, emptyStack } from './stack';
import { Storage, emptyStorage } from './storage';

interface StateInterface {
  code: Buffer;
  programCounter: number;
  running: boolean;
  stack: Stack;
  storage: Storage;
}

export class State extends Record<StateInterface>({
  code: Buffer.from([]),
  programCounter: 0,
  running: true,
  stack: emptyStack,
  storage: emptyStorage,
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
  stackFirst(): number {
    return this.stack.first();
  }

  popStack(): State {
    return this.set('stack', this.stack.delete(0));
  }

  pushStack(value: number): State {
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
  storeAt(value: number, address: number): State {
    return this.set('storage', this.storage.set(address, value));
  }

  /*
  programCounter: 0,
  running: true,
  stack: emptyStack,
  code: Buffer.from([]),
  storage: emptyStorage,
  */

  toString(): string {
    return `PC: ${this.programCounter}, code: ${this.code.toString('hex')}, running: ${this.running}, \
stack: ${this.stack}, storage: ${this.storage}`;
  }
}