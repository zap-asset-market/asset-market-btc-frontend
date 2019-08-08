import web3 from '../web3.js';
import Addresses from './contractAddresses.json';

const abi = [
  {
    constant: true,
    inputs: [],
    name: 'coordinator',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'auxiliaryMarketToken',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'mainMarket',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'zapToken',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'bondage',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'oracleAddress',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'dispatch',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        name: '_zapCoor',
        type: 'address'
      },
      {
        name: '_oracleAddress',
        type: 'address'
      },
      {
        name: '_endpoint',
        type: 'bytes32'
      },
      {
        name: '_assetSymbol',
        type: 'bytes32'
      },
      {
        name: '_assetClass',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'zapInWei',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'assetInWei',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'zapInUsd',
        type: 'string'
      },
      {
        indexed: false,
        name: 'assetInUsd',
        type: 'string'
      }
    ],
    name: 'Results',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'sender',
        type: 'address'
      },
      {
        indexed: false,
        name: 'totalWeiZap',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'amt',
        type: 'uint256'
      }
    ],
    name: 'Bought',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'sender',
        type: 'address'
      },
      {
        indexed: false,
        name: 'totalWeiZap',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'amt',
        type: 'uint256'
      }
    ],
    name: 'Sold',
    type: 'event'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_quantity',
        type: 'uint256'
      }
    ],
    name: 'buy',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_quantity',
        type: 'uint256'
      }
    ],
    name: 'sell',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'id',
        type: 'uint256'
      },
      {
        name: 'response1',
        type: 'string'
      },
      {
        name: 'response2',
        type: 'string'
      },
      {
        name: 'response3',
        type: 'string'
      },
      {
        name: 'response4',
        type: 'string'
      }
    ],
    name: 'callback',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_address',
        type: 'address'
      }
    ],
    name: 'getZapBalance',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'allocateZap',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'getAMTBalance',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

export default new web3.eth.Contract(abi, Addresses.auxiliaryMarket);
