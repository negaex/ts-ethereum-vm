
export class InvalidBinary extends Error {
  constructor(...args: any[]) {
    super(highlight(args[0]));
    Error.captureStackTrace(this, InvalidBinary);
  }
}

export class VMError extends Error {
  constructor(...args: any[]) {
    super(highlight(args[0]));
    Error.captureStackTrace(this, InvalidBinary);
  }
}

const highlight = (msg: string): string => {
  return msg.replace('//', '\x1b[31m').replace('\\', '\x1b[0m');
};