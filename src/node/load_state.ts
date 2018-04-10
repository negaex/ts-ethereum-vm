import { Node } from './node';
import { N256 } from '../lib/N256';
import { Account, Address, emptyAccounts, emptyAccount } from '../state/account';
import { Blockchain, emptyBlockchain } from '../state/blockchain';
import { newBlock } from '../state/block';
import { Transaction } from '../state/transaction';
import { assemble } from '../assembler/assembler';
import { ecrecover } from '../crypto/crypto';

export const loadState = (json: any): Blockchain => {
    let blockchain = new Blockchain();
    let accounts = emptyAccounts;


    for (let pre in json.pre) {
        const address = new N256(pre, "hex");
        const accData = json.pre[pre];
        const account: Account = emptyAccount
            .set("address", address)
            .set("nonce", new N256(accData.nonce, "hex"))
            .set("balance", new N256(accData.balance, "hex"))
            // .set("storage", new Buffer(accData.storage, "hex"))
            .set("code", new Buffer(accData.code, "hex"))
        accounts = accounts.set(address, account);
    };

    // Genesis block
    const coinbase = new N256(json.genesisBlockHeader.coinbase, "hex");
    const genesis = newBlock(coinbase, accounts)
    blockchain = blockchain.addBlock(genesis.commit());


    for (let blockData of json.blocks) {

        if (blockData.reverted) {
            // console.log(blockData);
            continue;
        }

        const coinbase = new N256(blockData.blockHeader.coinbase, "hex")

        let block = newBlock(coinbase, blockchain.getAccounts());

        for (let txData of blockData.transactions) {

            const transaction: Transaction = new Transaction({
                nonce: new N256(txData.nonce, "hex"),
                value: new N256(txData.value, "hex"),
                data: assemble(txData.data),
                gasLimit: new N256(txData.gasLimit, "hex"),
                gasPrice: new N256(txData.gasPrice, "hex"),
                r: new N256(txData.r, "hex"),
                v: new N256(txData.v, "hex"),
                s: new N256(txData.s, "hex"),
                to: new N256(txData.to, "hex"),
            });


            block = block.addTransaction(transaction);
        }

        blockchain = blockchain.addBlock(block.commit());

    }


    return blockchain;
}