import { Record } from '../lib/record';
import { Map, List } from 'immutable';
import { Bit, N256, Ox0 } from '../lib/N256';
import { N8, fromN256 } from '../lib/N8';

interface MemoryInterface {
    memory: Map<string, N8>;
    highest: N256;
}
  
export class Memory extends Record<MemoryInterface>({
    memory: Map<string, N8>(),
    highest: Ox0,
  }) {

    storeByte(index: N256, value: N8): Memory {
        return this.set('memory', this.memory.set(index.toBinary(), value));
    }

    store(index: N256, value: N256): Memory {
        let memory = this.memory;
        const values: N8[] = fromN256(value);
        let gas = 0;
        for (let i = 0; i < values.length; i++) {
            memory = memory.set(index.toBinary(), values[i]);
            index = index.add(1);
        }
        let highest = this.highest;
        // Todo: should be aligned to %32
        if (index.greaterThan(this.highest)) {
            highest = index;
        }
        // Todo: calculate gas
        return this.set('memory', memory).set('highest', highest);
    }

    retrieveBytes(index: N256, length: N256): Buffer {
        let ret: List<number> = List<number>();
        for (let i = Ox0; i.lessThan(length); i = i.add(1)) {
            ret = ret.concat((this.memory.get(index.toBinary()) || new N8()).toNumber()).toList();
            index = index.add(1);
        }
        return new Buffer(ret.toArray());
    }

    retrieve(index: N256): N256 {
        let ret: List<Bit> = List<Bit>();
        for (let i = 0; i < 32; i++) {
            ret = ret.concat((this.memory.get(index.toBinary()) || new N8()).value).toList();
            index = index.add(1);
        }
        return new N256(ret);
    }

    log(): string {
        let ret = '[';
        const highest = this.highest;
        for (let i = 0; i < highest.toNumber(); i++) {
            ret += ` ${(this.memory.get(new N256(i).toBinary()) || new N8()).toHex()}`;
        }
        ret += ' ]';
        return ret;
    }
}