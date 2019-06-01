import { N256 } from '../lib/N256';
import { sha3 } from '../lib/sha3';

const secp256k1 = require('secp256k1');

export type Signature = {
    r: N256,
    s: N256,
    v: N256,
};

// Borrowed from ethereumjs/ethereumjs-util

export const ecrecover = (msgHash: N256, v: N256, r: N256, s: N256): N256 => {
    const signature = Buffer.concat([r.toBuffer(false), s.toBuffer(false)], 64);
    const recovery = v.toNumber() - 27;
    if (recovery !== 0 && recovery !== 1) {
        throw new Error('Invalid signature v value');
    }
    const senderPubKey = secp256k1.recover(msgHash.toBuffer(), signature, recovery);
    let ret = secp256k1.publicKeyConvert(senderPubKey, false).slice(1);

    ret = sha3(ret).toBuffer().slice(-20);
    return new N256(ret);
};

export const ecsign = function (msgHash: N256, privateKey: N256): Signature {
    const sig = secp256k1.sign(msgHash, privateKey);

    const ret: Signature = {
        r: new N256(sig.signature.slice(0, 32)),
        s: new N256(sig.signature.slice(32, 64)),
        v: new N256(sig.recovery + 27),
    };
    return ret;
};