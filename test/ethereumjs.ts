/**
 * LICENSE: https://www.mozilla.org/en-US/MPL/2.0/
 * https://github.com/ethereumjs/ethereumjs-vm/
 */

import { expect, should } from 'chai';
should();
import 'mocha';
import { runVMTest } from './VMTestsRunner';

const testing = require('ethereumjs-testing');
// tests which should be fixed
const skipBroken = [
  'CreateHashCollision', // impossible hash collision on generating address
  'RecursiveCreateContracts',
  'createJS_ExampleContract', // creates an account that already exsists
  'CreateCollisionToEmpty', // temporary till fixed (2017-09-21)
  'TransactionCollisionToEmptyButCode', // temporary till fixed (2017-09-21)
  'TransactionCollisionToEmptyButNonce', // temporary till fixed (2017-09-21)
  'RevertDepthCreateAddressCollision', // test case is wrong
  'randomStatetest642' // BROKEN, rustbn.js error
];

// tests skipped due to system specifics / design considerations
const skipPermanent = [
  'SuicidesMixingCoinbase', // sucides to the coinbase, since we run a blockLevel we create coinbase account.
  'static_SuicidesMixingCoinbase', // sucides to the coinbase, since we run a blockLevel we create coinbase account.
  'ForkUncle', // Only BlockchainTest, correct behaviour unspecified (?)
  'UncleFromSideChain' // Only BlockchainTest, same as ForkUncle, the TD is the same
  // for two diffent branches so its not clear which one should be the finally chain
];

// tests running slow (run from time to time)
const skipSlow = [
  'Call50000', // slow
  'Call50000_ecrec', // slow
  'Call50000_identity', // slow
  'Call50000_identity2', // slow
  'Call50000_sha256', // slow
  'Call50000_rip160', // slow
  'Call50000bytesContract50_1', // slow
  'Call50000bytesContract50_2',
  'Call1MB1024Calldepth', // slow
  'static_Call1MB1024Calldepth', // slow
  'static_Call50000', // slow
  'static_Call50000_ecrec',
  'static_Call50000_identity',
  'static_Call50000_identity2',
  'static_Call50000_rip160',
  'static_Return50000_2',
  'Callcode50000', // slow
  'Return50000', // slow
  'Return50000_2', // slow
  'static_Call50000', // slow
  'static_Call50000_ecrec', // slow
  'static_Call50000_identity', // slow
  'static_Call50000_identity2', // slow
  'static_Call50000_sha256', // slow
  'static_Call50000_rip160', // slow
  'static_Call50000bytesContract50_1', // slow
  'static_Call50000bytesContract50_2',
  'static_Call1MB1024Calldepth', // slow
  'static_Callcode50000', // slow
  'static_Return50000', // slow
  'static_Return50000_2' // slow
];

/*
NOTE: VM tests have been disabled since they are generated using Frontier gas costs,
and ethereumjs-vm doesn't support historical fork rules
TODO: some VM tests do not appear to be executing (don't print an "ok" statement):
...
# file: vmLogTest test: log0_emptyMem
ok 38984 valid gas usage
# file: vmLogTest test: log0_logMemStartTooHigh
# file: vmLogTest test: log0_logMemsizeTooHigh
# file: vmLogTest test: log0_logMemsizeZero
ok 38985 valid gas usage
# file: vmLogTest test: log0_nonEmptyMem
*/

const skipVM = [
  // slow performance tests
  'loop-mul',
  'loop-add-10M',
  'loop-divadd-10M',
  'loop-divadd-unr100-10M',
  'loop-exp-16b-100k',
  'loop-exp-1b-1M',
  'loop-exp-2b-100k',
  'loop-exp-32b-100k',
  'loop-exp-4b-100k',
  'loop-exp-8b-100k',
  'loop-exp-nop-1M',
  'loop-mulmod-2M',
  // some VM tests fail because the js runner executes CALLs
  // see https://github.com/ethereum/tests/wiki/VM-Tests 
  // > Since these tests are meant only as a basic test of VM operation,
  // the CALL and CREATE instructions are not actually executed.
  'ABAcalls0',
  'ABAcallsSuicide0',
  'ABAcallsSuicide1',
  'sha3_bigSize',
  'CallRecursiveBomb0',
  'CallToNameRegistrator0',
  'CallToPrecompiledContract',
  'CallToReturn1',
  'PostToNameRegistrator0',
  'PostToReturn1',
  'callcodeToNameRegistrator0',
  'callcodeToReturn1',
  'callstatelessToNameRegistrator0',
  'callstatelessToReturn1',
  'createNameRegistrator',
  'randomTest643' // TODO fix this
];

function getSkipTests (choices: any) {
  let skipTests: any = [];
  choices = choices.toLowerCase();
  if (choices !== 'none') {
    let choicesList = choices.split(',');
    let all = choicesList.includes('all');
    if (all || choicesList.includes('broken')) {
      skipTests = skipTests.concat(skipBroken);
    }
    if (all || choicesList.includes('permanent')) {
      skipTests = skipTests.concat(skipPermanent);
    }
    if (all || choicesList.includes('slow')) {
      skipTests = skipTests.concat(skipSlow);
    }
  }
  return skipTests;
}

const tests: any = [];
describe('EthereumJS', () => {
  before(async () => {

    console.log('!!!');

    const setName = 'VMTests';
    let testGetterArgs: any = {};

    testGetterArgs.skipTests = getSkipTests('ALL');
    testGetterArgs.skipVM = skipVM;

    // runnerArgs.vmtrace = true; // for VMTests

    console.log(setName);
    await testing.getTestsFromArgs(
      setName,
      (fileName: any, testName: any, test: any) => {
        return new Promise(
          (resolve, reject) => {
            // console.log(`file: ${fileName} test: ${testName}`);
            // runVMTest({}, test, resolve);
            tests.push([test, testName, fileName]);
            resolve(true);
          }
        ).catch(err => console.log(err));
      },
      testGetterArgs
    );
  });

  it('', function (done: any) {
    console.log(tests.length);
    tests.forEach(function([test, testName, fileName]: any, indexIfYouNeedIt: number) {
        if (testName !== 'randomVMtest') {
          console.log(`file: ${fileName} test: ${testName}`);
          runVMTest({}, test, true);
        }
    });
    done();
}).timeout(10000);

});
