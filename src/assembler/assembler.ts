
import { instructions } from '../instructions/instructions';

export function assemble(code: string): Buffer {
    // TODO: Implement assembler!
    
    return Buffer.from(code.replace(/\s/g, ''), 'hex');
}