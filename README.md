# Typescript EVM (Ethereum Virtual Machine)

> This library is a work in progress.

The OpCode behaviour is implemented in [operations.ts](https://github.com/***REMOVED***/ts-ethereum-vm/blob/master/src/run/operations.ts).

## Example

Deploying the following code:

```js
pragma solidity ^0.4.11;

contract C {
  uint256 a;

  function add(uint256 b, uint256 c) public {
      a = b + c;
  }
  
  function getA() public view returns (uint256) {
      return a;
  }
}
```

and calling it:

```js
add(2, 3);
```

will output the folling state (note the storage is set to 101, 5 in binary):

![Preview](https://i.imgur.com/TvGfQcX.png)

## References

* [Ethereum Yellow Paper](http://gavwood.com/Paper.pdf)
* [Diving into the EVM](https://blog.qtum.org/diving-into-the-ethereum-vm-6e8d5d2f3c30) (parts 1 to 6)
* [EVM in clojure](https://nervous.io/clojure/crypto/2017/09/12/clojure-evm/)
* [Notes on the EVM](https://github.com/CoinCulture/evm-tools/blob/master/analysis/guide.md)
