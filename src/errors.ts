
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

export function highlight(msg: string): string {
  return msg.replace(new RegExp('//', 'g'), '\x1b[32m').replace(new RegExp('\\\\', 'g'), '\x1b[0m')
    .replace(new RegExp('<<', 'g'), '\x1b[33m').replace(new RegExp('>>', 'g'), '\x1b[0m');
}