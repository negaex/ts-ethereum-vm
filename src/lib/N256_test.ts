import { N256 } from './N256';
import { expect, should } from 'chai';
should();
import 'mocha';

describe('N256', () => {

  it('can load number', () => {
    (new N256(0)).toNumber().should.equal(0);
    (new N256(1)).toNumber().should.equal(1);
    (new N256(10)).toNumber().should.equal(10);
    (new N256(999)).toNumber().should.equal(999);
    (new N256(0).not().toNumber().should.equal((2 ** 256) - 1));
    (new N256(2 ** 256).toNumber().should.equal(0));
  });

  it('can shift numbers', () => {
    (new N256(0)).shiftLeft(1).toNumber().should.equal(0);
    (new N256(1)).shiftLeft(1).toNumber().should.equal(2);
    (new N256(100)).shiftLeft(1).toNumber().should.equal(200);
    (new N256(1)).shiftLeft(10).toNumber().should.equal(1024);

    (new N256(0)).shiftRight(1).toNumber().should.equal(0);
    (new N256(2)).shiftRight(1).toNumber().should.equal(1);
    (new N256(200)).shiftRight(1).toNumber().should.equal(100);
    (new N256(1024)).shiftRight(10).toNumber().should.equal(1);
  });

  it('can add numbers', () => {
    (new N256(1)).add(10).toNumber().should.equal(11);
    (new N256(2 ** 10)).add(2 ** 11).toNumber().should.equal(3072);
    (new N256(0)).not().add(1).toNumber().should.equal(0);
  });

  it('can subtract numbers', () => {
    (new N256(10)).sub(1).toNumber().should.equal(9);
    (new N256(8)).sub(1).toNumber().should.equal(7);
    (new N256(2 ** 11)).sub(2 ** 10).toNumber().should.equal(1024);
    (new N256(0)).sub(1).not().toNumber().should.equal(0);
  });

  it('can multiply numbers', () => {
    (new N256(2)).mul(3).toNumber().should.equal(6);
    (new N256(127)).mul(127).toNumber().should.equal(16129);
    (new N256(2 ** 34 - 1)).mul(2 ** 34 - 1).toNumber().should.equal(295147905144993100000);
    (new N256()).not().mul(new N256().not()).toNumber().should.equal(1);
  });

  it('can divide numbers', () => {
    (new N256(6)).div(3).toNumber().should.equal(2);
    (new N256(16129)).div(127).toNumber().should.equal(127);
    ((new N256(1)).div(2)).toNumber().should.equal(0);
    ((new N256(5)).div(4)).toNumber().should.equal(1);
    const num = (new N256(2)).exp(27).sub(1);
    (num.exp(2)).div(num).toBinary().should.equal(num.toBinary());

    (new N256(0).not()).div(2).toBinary().should.equal(new N256(2).exp(255).sub(1).toBinary());
  });

  it('can exponentiate numbers', () => {
    (new N256(6)).exp(2).toNumber().should.equal(36);
    (new N256(100)).exp(2).toNumber().should.equal(10000);
    (new N256(17)).exp(7).toNumber().should.equal(410338673);
    (new N256(19)).exp(1).toNumber().should.equal(19);
    (new N256(2)).exp(0).toNumber().should.equal(1);
    (new N256(0)).exp(0).toNumber().should.equal(1);
  });

  it('can load buffer', () => {
    (new N256(new Buffer([0x01, 0x02])).toNumber()).should.equal(258);
  });

  it('can do mod', () => {
    (new N256(6)).mod(4).toNumber().should.equal(2);
  });

});