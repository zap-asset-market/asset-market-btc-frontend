import Web3 from 'web3';

const options = {
  transactionConfirmationBlocks: 1
};

// let web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545/');

// const web3 = new Web3(web3Provider, null, options);

const web3 = new Web3("ws://localhost:9545");
// Modern dapp browsers...
// if (window.ethereum) {
//   App.web3Provider = window.ethereum;
//   try {
//     // Request account access
//     await window.ethereum.enable();
//   } catch (error) {
//     // User denied account access...
//     console.error('User denied account access');
//   }
// }
// // Legacy dapp browsers...
// else if (window.web3) {
//   App.web3Provider = window.web3.currentProvider;
// }
// // If no injected web3 instance is detected, fall back to Ganache
// else {
//   App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
// }
// web3 = new Web3(App.web3Provider);

export default web3;
