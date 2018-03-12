const Web3: any = require('web3');
const web3: any = new Web3(
  new Web3.providers.HttpProvider('http://localhost:9090')
);

async function main(): Promise<void> {
  var balance: any = await web3.eth.getBalance('0x0000000000000000000000000000000000000000');
  console.log(balance);
}

main();