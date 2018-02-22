const Web3 = require('web3');
const web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:9090')
);

const main = async () => {
  var balance = await web3.eth.getBalance('0x0000000000000000000000000000000000000000');
  console.log(balance);
};

main();