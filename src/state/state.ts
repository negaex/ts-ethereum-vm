import { Record } from '../lib/record';
import { Stack, emptyStack, stackToString } from './stack';
import { Storage, emptyStorage, storageToString } from './storage';
import { Memory } from './memory';
import { N256 } from '../lib/N256';
import { N8 } from '../lib/N8';
import { highlight } from '../errors';

interface StateInterface {
  code: Buffer;
  programCounter: number;
  running: boolean;
  stack: Stack;
  storage: Storage;
  gasUsed: number;
  memory: Memory;
  logInfo: string;
  returnValue: Buffer;
  caller: N256;
  callData: Buffer;
}

export class State extends Record<StateInterface>({
  code: Buffer.from([]),
  programCounter: 0,
  running: true,
  stack: emptyStack,
  storage: emptyStorage,
  gasUsed: 0,
  memory: new Memory(),
  logInfo: '',
  returnValue: null,
  caller: new N256(0),
  callData: null,
}) {

  getCallData(): Buffer {
    return this.callData;
  }

  setCallData(callData: Buffer): State {
    return this.set('callData', callData);
  }

  setCaller(caller: N256): State {
    return this.set('caller', caller);
  }

  // Return
  setReturnValue(value: Buffer): State {
    return this.set('returnValue', value);
  }

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

  popStack(): [N256, State] {
    return [this.stack.first(), this.set('stack', this.stack.delete(0))];
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

  setMemoryByteAt(address: N256, byte: N8): State {
    return this.set('memory', this.memory.storeByte(address, byte));
  }

  setMemoryAt(address: N256, value: N256): State {
    return this.set('memory', this.memory.store(address, value));
  }

  getMemoryAt(address: N256): N256 {
    return this.memory.retrieve(address);
  }

  getMemoryAsBuffer(address: N256, length: N256): Buffer {
    return this.memory.retrieveBytes(address, length);
  }

  // Gas
  useGas(gas: number): State {
    return this.set('gasUsed', this.get('gasUsed') + gas);
  }

  setLogInfo(info: string): State {
    return this.set('logInfo', info);
  }

  appendLogInfo(info: string): State {
    return this.set('logInfo', this.logInfo + info);
  }

  /*
  programCounter: 0,
  running: true,
  stack: emptyStack,
  code: Buffer.from([]),
  storage: emptyStorage,
  */

  toString(): string {
    // console.log(this.memory.log());
    const memStr = this.memory.log();
    return highlight(`//PC\\: ${this.programCounter}, //running\\: ${this.running}, //gasUsed\\: ${this.gasUsed}\n\
//stack\\: ${stackToString(this.stack)}
//storage\\: ${storageToString(this.storage)}
//memory\\: ${memStr}`);
  }
}