import { Record } from '../lib/record';
import { Stack, emptyStack, stackToString } from './stack';
import { Storage, emptyStorage, storageToString } from './storage';
import { Memory } from './memory';
import { N256, Ox0 } from '../lib/N256';
import { N8 } from '../lib/N8';
import { highlight, VMError } from '../errors';
import { Address } from './account';
import { Transaction, emptyTransaction } from './transaction';
import { Block, emptyBlock } from './block';
import { Account } from './account';

interface MachineStateInterface {
  code: Buffer;
  programCounter: number;
  running: boolean;
  stack: Stack;
  gasUsed: number;
  memory: Memory;
  logInfo: string;
  returnValue: Buffer;
  caller: Address;
  address: Address;
  callData: Buffer;

  currentBlock: Block;
  currentTransaction: Transaction;
  accounts: Map<Address, Account>;
}

export class MachineState extends Record<MachineStateInterface>({
  code: Buffer.from([]),
  programCounter: 0,
  running: true,
  stack: emptyStack,
  gasUsed: 0,
  memory: new Memory(),
  logInfo: '',
  returnValue: null,
  caller: Ox0,
  address: Ox0,
  callData: null,

  currentBlock: emptyBlock,
  currentTransaction: emptyTransaction,
  accounts: new Map<Address, Account>(),
}) {

  setCallData(callData: Buffer): MachineState {
    return this.set('callData', callData);
  }

  setCaller(caller: N256): MachineState {
    return this.set('caller', caller);
  }

  // Return
  setReturnValue(value: Buffer): MachineState {
    return this.set('returnValue', value);
  }

  // Code
  loadCode(code: Buffer): MachineState {
    return this.set('code', code);
  }

  hasCode(): boolean {
    return this.programCounter < this.code.length;
  }

  nextCode(): number {
    return this.code[this.programCounter];
  }

  // Program counter
  incrementPC(amount: number = 1): MachineState {
    return this.set('programCounter', this.programCounter + amount);
  }

  setPC(pc: number): MachineState {
    return this.set('programCounter', pc);
  }

  // Stack
  stackFirst(): N256 {
    return this.stack.first();
  }

  popStack(): [N256, MachineState] {
    if (this.get('stack').size === 0) {
      throw new VMError('Stack underflow');
    }
    return [this.stack.first(), this.set('stack', this.stack.delete(0))];
  }

  pushStack(value: N256): MachineState {
    if (this.get('stack').size === 1023) {
      throw new VMError('Stack overflow');
    }
    return this.set('stack', this.stack.insert(0, value));
  }

  // running status
  stop(): MachineState {
    return this.set('running', false);
  }

  start(): MachineState {
    return this.set('running', true);
  }

  // Storage
  storeAt(location: N256, value: N256): MachineState {
    let account = this.accounts.get(this.address);
    let storage = emptyStorage;
    if (account) {
      storage = account.storage;
    }
    storage = storage.set(location, value);
    account = account.set('storage', storage);
    return this.set('accounts', this.accounts.set(this.address, account));
  }

  storedAt(location: N256): N256 {
    return this.accounts.get(this.address).storage.get(location) || new N256();
  }

  setMemoryByteAt(address: N256, byte: N8): MachineState {
    return this.set('memory', this.memory.storeByte(address, byte));
  }

  setMemoryAt(address: N256, value: N256): MachineState {
    return this.set('memory', this.memory.store(address, value));
  }

  getMemoryAt(address: N256): N256 {
    return this.memory.retrieve(address);
  }

  getMemoryAsBuffer(address: N256, length: N256): Buffer {
    return this.memory.retrieveBytes(address, length);
  }

  // Gas
  useGas(gas: number): MachineState {
    return this.set('gasUsed', this.get('gasUsed') + gas);
  }

  setLogInfo(info: string): MachineState {
    return this.set('logInfo', info);
  }

  appendLogInfo(info: string): MachineState {
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
    const account = this.accounts.get(this.address);
    return highlight(`//PC\\: ${this.programCounter}, //running\\: ${this.running}, //gasUsed\\: ${this.gasUsed}\n\
//stack\\: ${stackToString(this.stack)}
//storage\\: ${storageToString(account ? account.storage : emptyStorage)}
//memory\\: ${memStr}`);
  }
}

export const emptyMachineState = new MachineState();