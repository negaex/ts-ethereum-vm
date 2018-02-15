
export interface OpCode {
  mnemonic: string;
  pop: number;
  push: number;
  gas: number;
  code: number;
}

export const instructions: { [code: number]: OpCode } = {

  // arithmetic
  0x00: { mnemonic: 'STOP', pop: 0, push: 0, gas: 0, code: 0x00 },
  0x01: { mnemonic: 'ADD', pop: 2, push: 1, gas: 3, code: 0x01 },
  0x02: { mnemonic: 'MUL', pop: 2, push: 1, gas: 5, code: 0x02 },
  0x03: { mnemonic: 'SUB', pop: 2, push: 1, gas: 3, code: 0x03 },
  0x04: { mnemonic: 'DIV', pop: 2, push: 1, gas: 5, code: 0x04 },
  0x05: { mnemonic: 'SDIV', pop: 2, push: 1, gas: 5, code: 0x05 },
  0x06: { mnemonic: 'MOD', pop: 2, push: 1, gas: 5, code: 0x06 },
  0x07: { mnemonic: 'SMOD', pop: 2, push: 1, gas: 5, code: 0x07 },
  0x08: { mnemonic: 'ADDMOD', pop: 3, push: 1, gas: 8, code: 0x08 },
  0x09: { mnemonic: 'MULMOD', pop: 3, push: 1, gas: 8, code: 0x09 },
  0x0a: { mnemonic: 'EXP', pop: 2, push: 1, gas: 10, code: 0x0a },
  0x0b: { mnemonic: 'SIGNEXTEND', pop: 2, push: 1, gas: 5, code: 0x0b },

  // boolean
  0x10: { mnemonic: 'LT', pop: 2, push: 1, gas: 3, code: 0x10 },
  0x11: { mnemonic: 'GT', pop: 2, push: 1, gas: 3, code: 0x11 },
  0x12: { mnemonic: 'SLT', pop: 2, push: 1, gas: 3, code: 0x12 },
  0x13: { mnemonic: 'SGT', pop: 2, push: 1, gas: 3, code: 0x13 },
  0x14: { mnemonic: 'EQ', pop: 2, push: 1, gas: 3, code: 0x14 },
  0x15: { mnemonic: 'ISZERO', pop: 1, push: 1, gas: 3, code: 0x15 },
  0x16: { mnemonic: 'AND', pop: 2, push: 1, gas: 3, code: 0x16 },
  0x17: { mnemonic: 'OR', pop: 2, push: 1, gas: 3, code: 0x17 },
  0x18: { mnemonic: 'XOR', pop: 2, push: 1, gas: 3, code: 0x18 },
  0x19: { mnemonic: 'NOT', pop: 1, push: 1, gas: 3, code: 0x19 },
  0x1a: { mnemonic: 'BYTE', pop: 2, push: 1, gas: 3, code: 0x1a },

  // crypto
  0x20: { mnemonic: 'SHA3', pop: 2, push: 1, gas: 30, code: 0x20 },

  // contract context
  0x30: { mnemonic: 'ADDRESS', pop: 0, push: 1, gas: 2, code: 0x30 },
  0x31: { mnemonic: 'BALANCE', pop: 1, push: 1, gas: 20, code: 0x31 },
  0x32: { mnemonic: 'ORIGIN', pop: 0, push: 1, gas: 2, code: 0x32 },
  0x33: { mnemonic: 'CALLER', pop: 0, push: 1, gas: 2, code: 0x33 },
  0x34: { mnemonic: 'CALLVALUE', pop: 0, push: 1, gas: 2, code: 0x34 },
  0x35: { mnemonic: 'CALLDATALOAD', pop: 1, push: 1, gas: 3, code: 0x35 },
  0x36: { mnemonic: 'CALLDATASIZE', pop: 0, push: 1, gas: 2, code: 0x36 },
  0x37: { mnemonic: 'CALLDATACOPY', pop: 3, push: 0, gas: 3, code: 0x37 },
  0x38: { mnemonic: 'CODESIZE', pop: 0, push: 1, gas: 2, code: 0x38 },
  0x39: { mnemonic: 'CODECOPY', pop: 3, push: 0, gas: 3, code: 0x39 },
  0x3a: { mnemonic: 'GASPRICE', pop: 0, push: 1, gas: 2, code: 0x3a },
  0x3b: { mnemonic: 'EXTCODESIZE', pop: 1, push: 1, gas: 20, code: 0x3b },
  0x3c: { mnemonic: 'EXTCODECOPY', pop: 4, push: 0, gas: 20, code: 0x3c },

  // blockchain context
  0x40: { mnemonic: 'BLOCKHASH', pop: 1, push: 1, gas: 20, code: 0x40 },
  0x41: { mnemonic: 'COINBASE', pop: 0, push: 1, gas: 2, code: 0x41 },
  0x42: { mnemonic: 'TIMESTAMP', pop: 0, push: 1, gas: 2, code: 0x42 },
  0x43: { mnemonic: 'NUMBER', pop: 0, push: 1, gas: 2, code: 0x43 },
  0x44: { mnemonic: 'DIFFICULTY', pop: 0, push: 1, gas: 2, code: 0x44 },
  0x45: { mnemonic: 'GASLIMIT', pop: 0, push: 1, gas: 2, code: 0x45 },

  // storage and execution
  0x50: { mnemonic: 'POP', pop: 1, push: 0, gas: 2, code: 0x50 },
  0x51: { mnemonic: 'MLOAD', pop: 1, push: 1, gas: 3, code: 0x51 },
  0x52: { mnemonic: 'MSTORE', pop: 2, push: 0, gas: 3, code: 0x52 },
  0x53: { mnemonic: 'MSTORE8', pop: 2, push: 0, gas: 3, code: 0x53 },
  0x54: { mnemonic: 'SLOAD', pop: 1, push: 1, gas: 50, code: 0x54 },
  0x55: { mnemonic: 'SSTORE', pop: 2, push: 0, gas: 500, code: 0x55 },
  0x56: { mnemonic: 'JUMP', pop: 1, push: 0, gas: 8, code: 0x56 },
  0x57: { mnemonic: 'JUMPI', pop: 2, push: 0, gas: 10, code: 0x57 },
  0x58: { mnemonic: 'PC', pop: 0, push: 1, gas: 2, code: 0x58 },
  0x59: { mnemonic: 'MSIZE', pop: 0, push: 1, gas: 2, code: 0x59 },
  0x5a: { mnemonic: 'GAS', pop: 0, push: 1, gas: 2, code: 0x5a },
  0x5b: { mnemonic: 'JUMPDEST', pop: 0, push: 0, gas: 1, code: 0x5b },

  // logging
  0xa0: { mnemonic: 'LOG0', pop: 2, push: 0, gas: 375, code: 0xa0 },
  0xa1: { mnemonic: 'LOG1', pop: 3, push: 0, gas: 750, code: 0xa1 },
  0xa2: { mnemonic: 'LOG2', pop: 4, push: 0, gas: 1125, code: 0xa2 },
  0xa3: { mnemonic: 'LOG3', pop: 5, push: 0, gas: 1500, code: 0xa3 },
  0xa4: { mnemonic: 'LOG4', pop: 6, push: 0, gas: 1875, code: 0xa4 },

  // arbitrary length storage (proposal for metropolis hardfork)
  0xe1: { mnemonic: 'SLOADBYTES', pop: 3, push: 0, gas: 50, code: 0xe1 },
  0xe2: { mnemonic: 'SSTOREBYTES', pop: 3, push: 0, gas: 500, code: 0xe2 },
  0xe3: { mnemonic: 'SSIZE', pop: 1, push: 1, gas: 50, code: 0xe3 },

  // closures
  0xf0: { mnemonic: 'CREATE', pop: 3, push: 1, gas: 32000, code: 0xf0 },
  0xf1: { mnemonic: 'CALL', pop: 7, push: 1, gas: 40, code: 0xf1 },
  0xf2: { mnemonic: 'CALLCODE', pop: 7, push: 1, gas: 40, code: 0xf2 },
  0xf3: { mnemonic: 'RETURN', pop: 2, push: 0, gas: 0, code: 0xf3 },
  0xf4: { mnemonic: 'DELEGATECALL', pop: 6, push: 0, gas: 40, code: 0xf4 },
  0xff: { mnemonic: 'SUICIDE', pop: 1, push: 0, gas: 0, code: 0xff },
};

// Push
for (let i = 0; i < 33; i++) {
  instructions[0x5f + i] = { mnemonic: `PUSH${i}`, pop: 0, push: 1, gas: 3, code: 0x5f + i };
}

// duplicate and swap
for (let i = 1; i < 17; i++) {
  instructions[0x7f + i] = { mnemonic: `DUP${i}`, pop: i, push: i + 1, gas: 3, code: 0x7f + i };
  instructions[0x8f + i] = { mnemonic: `SWAP${i}`, pop: i + 1, push: i + 1, gas: 3, code: 0x8f + i };
}