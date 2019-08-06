import web3 from '../web3.js';
import Addresses from './contractAddresses.json';

const abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "db",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "arbiterAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "updateDependencies",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "selfDestruct",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "dispatchAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "c",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "holder",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "oracle",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "numZap",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "Bound",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "holder",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "oracle",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "Unbound",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "holder",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "oracle",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "Escrowed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "holder",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "oracle",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "Released",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "holder",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "oracle",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "Returned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "bond",
      "outputs": [
        {
          "name": "bound",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "unbond",
      "outputs": [
        {
          "name": "unbound",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "delegateBond",
      "outputs": [
        {
          "name": "boundZap",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "escrowDots",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "releaseDots",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "returnDots",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "numDots",
          "type": "uint256"
        }
      ],
      "name": "calcZapForDots",
      "outputs": [
        {
          "name": "numZap",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        },
        {
          "name": "totalBound",
          "type": "uint256"
        }
      ],
      "name": "currentCostOfDot",
      "outputs": [
        {
          "name": "cost",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        }
      ],
      "name": "dotLimit",
      "outputs": [
        {
          "name": "limit",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        }
      ],
      "name": "getZapBound",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "oracleAddress",
          "type": "address"
        }
      ],
      "name": "isProviderInitialized",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        }
      ],
      "name": "getEndpointBroker",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        }
      ],
      "name": "getNumEscrow",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        }
      ],
      "name": "getNumZap",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        }
      ],
      "name": "getDotsIssued",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "name": "endpoint",
          "type": "bytes32"
        }
      ],
      "name": "getBoundDots",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        }
      ],
      "name": "getIndexSize",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "holderAddress",
          "type": "address"
        },
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getOracleAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

export default new web3.eth.Contract(abi, Addresses.bondage)