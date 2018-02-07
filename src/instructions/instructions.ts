
export interface OpCode {
  mnemonic: string;
  pop: number;
  push: number;
  gas: number;
}

export const instructions: { [code: number]: OpCode } = {

  // arithmetic
  0x00: { mnemonic: 'STOP', pop: 0, push: 0, gas: 0 },
  0x01: { mnemonic: 'ADD', pop: 2, push: 1, gas: 3 },
  0x02: { mnemonic: 'MUL', pop: 2, push: 1, gas: 5 },
  0x03: { mnemonic: 'SUB', pop: 2, push: 1, gas: 3 },
  0x04: { mnemonic: 'DIV', pop: 2, push: 1, gas: 5 },
  0x05: { mnemonic: 'SDIV', pop: 2, push: 1, gas: 5 },
  0x06: { mnemonic: 'MOD', pop: 2, push: 1, gas: 5 },
  0x07: { mnemonic: 'SMOD', pop: 2, push: 1, gas: 5 },
  0x08: { mnemonic: 'ADDMOD', pop: 3, push: 1, gas: 8 },
  0x09: { mnemonic: 'MULMOD', pop: 3, push: 1, gas: 8 },
  0x0a: { mnemonic: 'EXP', pop: 2, push: 1, gas: 10 },
  0x0b: { mnemonic: 'SIGNEXTEND', pop: 2, push: 1, gas: 5 },

  // boolean
  0x10: { mnemonic: 'LT', pop: 2, push: 1, gas: 3 },
  0x11: { mnemonic: 'GT', pop: 2, push: 1, gas: 3 },
  0x12: { mnemonic: 'SLT', pop: 2, push: 1, gas: 3 },
  0x13: { mnemonic: 'SGT', pop: 2, push: 1, gas: 3 },
  0x14: { mnemonic: 'EQ', pop: 2, push: 1, gas: 3 },
  0x15: { mnemonic: 'ISZERO', pop: 1, push: 1, gas: 3 },
  0x16: { mnemonic: 'AND', pop: 2, push: 1, gas: 3 },
  0x17: { mnemonic: 'OR', pop: 2, push: 1, gas: 3 },
  0x18: { mnemonic: 'XOR', pop: 2, push: 1, gas: 3 },
  0x19: { mnemonic: 'NOT', pop: 1, push: 1, gas: 3 },
  0x1a: { mnemonic: 'BYTE', pop: 2, push: 1, gas: 3 },

  // crypto
  0x20: { mnemonic: 'SHA3', pop: 2, push: 1, gas: 30 },

  // contract context
  0x30: { mnemonic: 'ADDRESS', pop: 0, push: 1, gas: 2 },
  0x31: { mnemonic: 'BALANCE', pop: 1, push: 1, gas: 20 },
  0x32: { mnemonic: 'ORIGIN', pop: 0, push: 1, gas: 2 },
  0x33: { mnemonic: 'CALLER', pop: 0, push: 1, gas: 2 },
  0x34: { mnemonic: 'CALLVALUE', pop: 0, push: 1, gas: 2 },
  0x35: { mnemonic: 'CALLDATALOAD', pop: 1, push: 1, gas: 3 },
  0x36: { mnemonic: 'CALLDATASIZE', pop: 0, push: 1, gas: 2 },
  0x37: { mnemonic: 'CALLDATACOPY', pop: 3, push: 0, gas: 3 },
  0x38: { mnemonic: 'CODESIZE', pop: 0, push: 1, gas: 2 },
  0x39: { mnemonic: 'CODECOPY', pop: 3, push: 0, gas: 3 },
  0x3a: { mnemonic: 'GASPRICE', pop: 0, push: 1, gas: 2 },
  0x3b: { mnemonic: 'EXTCODESIZE', pop: 1, push: 1, gas: 20 },
  0x3c: { mnemonic: 'EXTCODECOPY', pop: 4, push: 0, gas: 20 },

  // blockchain context
  0x40: { mnemonic: 'BLOCKHASH', pop: 1, push: 1, gas: 20 },
  0x41: { mnemonic: 'COINBASE', pop: 0, push: 1, gas: 2 },
  0x42: { mnemonic: 'TIMESTAMP', pop: 0, push: 1, gas: 2 },
  0x43: { mnemonic: 'NUMBER', pop: 0, push: 1, gas: 2 },
  0x44: { mnemonic: 'DIFFICULTY', pop: 0, push: 1, gas: 2 },
  0x45: { mnemonic: 'GASLIMIT', pop: 0, push: 1, gas: 2 },

  // storage and execution
  0x50: { mnemonic: 'POP', pop: 1, push: 0, gas: 2 },
  0x51: { mnemonic: 'MLOAD', pop: 1, push: 1, gas: 3 },
  0x52: { mnemonic: 'MSTORE', pop: 2, push: 0, gas: 3 },
  0x53: { mnemonic: 'MSTORE8', pop: 2, push: 0, gas: 3 },
  0x54: { mnemonic: 'SLOAD', pop: 1, push: 1, gas: 50 },
  0x55: { mnemonic: 'SSTORE', pop: 2, push: 0, gas: 0 },
  0x56: { mnemonic: 'JUMP', pop: 1, push: 0, gas: 8 },
  0x57: { mnemonic: 'JUMPI', pop: 2, push: 0, gas: 10 },
  0x58: { mnemonic: 'PC', pop: 0, push: 1, gas: 2 },
  0x59: { mnemonic: 'MSIZE', pop: 0, push: 1, gas: 2 },
  0x5a: { mnemonic: 'GAS', pop: 0, push: 1, gas: 2 },
  0x5b: { mnemonic: 'JUMPDEST', pop: 0, push: 0, gas: 1 },

  // logging
  0xa0: { mnemonic: 'LOG0', pop: 2, push: 0, gas: 375 },
  0xa1: { mnemonic: 'LOG1', pop: 3, push: 0, gas: 750 },
  0xa2: { mnemonic: 'LOG2', pop: 4, push: 0, gas: 1125 },
  0xa3: { mnemonic: 'LOG3', pop: 5, push: 0, gas: 1500 },
  0xa4: { mnemonic: 'LOG4', pop: 6, push: 0, gas: 1875 },

  // arbitrary length storage (proposal for metropolis hardfork)
  0xe1: { mnemonic: 'SLOADBYTES', pop: 3, push: 0, gas: 50 },
  0xe2: { mnemonic: 'SSTOREBYTES', pop: 3, push: 0, gas: 0 },
  0xe3: { mnemonic: 'SSIZE', pop: 1, push: 1, gas: 50 },

  // closures
  0xf0: { mnemonic: 'CREATE', pop: 3, push: 1, gas: 32000 },
  0xf1: { mnemonic: 'CALL', pop: 7, push: 1, gas: 40 },
  0xf2: { mnemonic: 'CALLCODE', pop: 7, push: 1, gas: 40 },
  0xf3: { mnemonic: 'RETURN', pop: 2, push: 0, gas: 0 },
  0xf4: { mnemonic: 'DELEGATECALL', pop: 6, push: 0, gas: 40 },
  0xff: { mnemonic: 'SUICIDE', pop: 1, push: 0, gas: 0 },
};

// Push
for (let i = 0; i < 33; i++) {
  instructions[0x5f + i] = { mnemonic: `PUSH${i}`, pop: 0, push: 1, gas: 3 };
}

// duplicate and swap
for (let i = 0; i < 17; i++) {
  instructions[0x7f + i] = { mnemonic: `DUP${i}`, pop: i, push: i + 1, gas: 3 };
  instructions[0x8f + i] = { mnemonic: `SWAP${i}`, pop: i + 1, push: i + 1, gas: 3 };
}