
import { Ox0, Ox1, N256 } from './lib/N256';
import { contractAddress } from './state/transaction';


console.log(contractAddress(new N256("0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0", "hex"), new N256(1)).toHexAddress());