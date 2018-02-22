import { Node } from './node';
import { N256 } from '../lib/N256';

type RPCMethod = (node: Node, params: any[]) => any;

const notImplemented: RPCMethod = (node: Node) => {
  throw new Error('RPC procedure not implemented');
};

export const methods: { [name: string]: RPCMethod } = {
  'web3_clientVersion':
    (node: Node) => 'ts-ethereum-vm 0.0.0',

  'web3_sha3': notImplemented,
  'net_version': notImplemented,
  'net_peerCount': notImplemented,
  'net_listening': notImplemented,
  'eth_protocolVersion': notImplemented,
  'eth_syncing': notImplemented,

  'eth_coinbase':
    (node: Node) => node.coinbase,

  'eth_mining':
    (node: Node) => false,

  'eth_hashrate':
    (node: Node) => 0,

  'eth_gasPrice': notImplemented,
  'eth_accounts': notImplemented,

  'eth_blockNumber':
    (node: Node) => node.blockchain.blocks.size,

  'eth_getBalance': (node: Node, params: any[]) =>
    node.getBalance(params[0], params[1]),

  'eth_getStorageAt': notImplemented,
  'eth_getTransactionCount': notImplemented,
  'eth_getBlockTransactionCountByHash': notImplemented,
  'eth_getBlockTransactionCountByNumber': notImplemented,
  'eth_getUncleCountByBlockHash': notImplemented,
  'eth_getUncleCountByBlockNumber': notImplemented,
  'eth_getCode': notImplemented,
  'eth_sign': notImplemented,
  'eth_sendTransaction': notImplemented,
  'eth_sendRawTransaction': notImplemented,
  'eth_call': notImplemented,
  'eth_estimateGas': notImplemented,
  'eth_getBlockByHash': notImplemented,
  'eth_getBlockByNumber': notImplemented,
  'eth_getTransactionByHash': notImplemented,
  'eth_getTransactionByBlockHashAndIndex': notImplemented,
  'eth_getTransactionByBlockNumberAndIndex': notImplemented,
  'eth_getTransactionReceipt': notImplemented,
  'eth_getUncleByBlockHashAndIndex': notImplemented,
  'eth_getUncleByBlockNumberAndIndex': notImplemented,
  'eth_getCompilers': notImplemented,
  'eth_compileLLL': notImplemented,
  'eth_compileSolidity': notImplemented,
  'eth_compileSerpent': notImplemented,
  'eth_newFilter': notImplemented,
  'eth_newBlockFilter': notImplemented,
  'eth_newPendingTransactionFilter': notImplemented,
  'eth_uninstallFilter': notImplemented,
  'eth_getFilterChanges': notImplemented,
  'eth_getFilterLogs': notImplemented,
  'eth_getLogs': notImplemented,
  'eth_getWork': notImplemented,
  'eth_submitWork': notImplemented,
  'eth_submitHashrate': notImplemented,
  'db_putString': notImplemented,
  'db_getString': notImplemented,
  'db_putHex': notImplemented,
  'db_getHex': notImplemented,
  'shh_post': notImplemented,
  'shh_version': notImplemented,
  'shh_newIdentity': notImplemented,
  'shh_hasIdentity': notImplemented,
  'shh_newGroup': notImplemented,
  'shh_addToGroup': notImplemented,
  'shh_newFilter': notImplemented,
  'shh_uninstallFilter': notImplemented,
  'shh_getFilterChanges': notImplemented,
  'shh_getMessages': notImplemented,
};