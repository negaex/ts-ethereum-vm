import { Record } from '../lib/record';
import { Map, List } from 'immutable';
import { Bit, N256 } from '../lib/N256';
import { N8, fromN256 } from '../lib/N8';
import { State } from './state';

export type Memory = Map<string, N8>;

export const emptyMemory = Map<string, N8>();

export const setMemoryByteAt = (memory: Memory, address: N256, byte: N8): Memory => {
    return memory.set(address.toBinary(), byte);
};

export const setMemoryAt = (memory: Memory, address: N256, value: N256): Memory => {
    // return this.set('memory', this.memory.store(address, value));
    const values: N8[] = fromN256(value);
    for (let i = 0; i < values.length; i++) {
        memory = memory.set(address.toBinary(), values[i]);
        address = address.add(1);
    }
    // Todo: calculate gas
    return memory;
};

export const getMemoryAt = (memory: Memory, address: N256): N256 => {
    let ret: List<Bit> = List();
    for (let i = 0; i < 32; i++) {
      ret = ret.concat((memory.get(address.toBinary()) || new N8()).value).toList();
    }
    return new N256(ret);
};

export function memoryToString(memory: Memory, ): string {
    let ret = '[';
    ret += memory.reduce((r, n8) => r + ' ' + new N256(n8.value).toNumber().toString(16), '');
    ret += ' ]';
    return ret;
}