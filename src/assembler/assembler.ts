
import { instructions } from '../instructions/instructions';

export function assemble(code: string): Buffer {
    // TODO: Implement assembler!
    
    return Buffer.from(code.replace('0x', '').replace(/\s/g, ''), 'hex');
}