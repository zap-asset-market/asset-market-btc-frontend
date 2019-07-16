import Web3 from 'web3';

const options = {
    transactionConfirmationBlocks: 1
}

const getProvider = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  } else if(window.web3){
    await window.web3.currentProvider.enable(); // request authentication
  }
};

getProvider();

const web3 = new Web3('http://localhost:9545', null, options);

export default web3;