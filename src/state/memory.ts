import { Record } from '../lib/record';
import { Map, List } from 'immutable';
import { Bit, N256 } from '../lib/N256';
import { N8, fromN256 } from '../lib/N8';

interface MemoryInterface {
    memory: Map<string, N8>;
    highest: N256;
  }
  
export class Memory extends Record<MemoryInterface>({
    memory: Map<string, N8>(),
    highest: new N256(0),
  }) {

    storeByte(index: N256, value: N8): Memory {
        return this.set('memory', this.memory.set(index.toBinary(), value));
    }

    store(index: N256, value: N256): Memory {
        const values: N8[] = fromN256(value);
        let newThis: Memory = this;
        let gas = 0;
        for (let i = 0; i < values.length; i++) {
            newThis = this.set('memory', this.memory.set(index.toBinary(), values[i]));
            index = index.add(1);
        }
        // Todo: should be aligned to %32
        if (index.greaterThan(this.highest)) {
            newThis = this.set('highest', index);
        }
        // Todo: calculate gas
        return newThis;
    }

    retrieve(index: N256): N256 {
        let ret: List<Bit>;
        for (let i = 0; i < 32; i++) {
            ret = ret.concat(this.memory.get(index.toBinary()).value || [0,0,0,0,0,0,0,0]).toList();
        }
        return new N256(ret);
    }

    log = (): string => {
        console.error('!!!!!!!');
        let ret = '[ ';
        const highest = this.highest;
        for (let i = 0; i < highest.toNumber(); i++) {
            ret += `0x${this.retrieve(new N256(i)).toNumber().toString(16)}`;
        }
        ret += ']';
        return ret;
    };
}