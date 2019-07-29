import React, { Component } from 'react';
import web3 from './web3.js';
import './App.css';
import Button from '@material-ui/core/Button';

import AuxiliaryMarket from './AuxiliaryMarket.js';
import AuxiliaryMarketToken from './AuxiliaryMarketToken.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: '',
      zapBalance: '',
      amtBalance: ''
    };
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    let currentPrice = await AuxiliaryMarket.methods.getCurrentPrice().call();
    let zapBalance = await AuxiliaryMarket.methods
      .getBalance(accounts[0])
      .call();
    let amtBalance = await AuxiliaryMarket.methods
      .getAMTBalance(accounts[0])
      .call();

    let currentPriceToString = currentPrice.toString();
    let zapBalanceToString = zapBalance.toString();
    let amtBalanceToString = amtBalance.toString();

    this.setState({
      currentPrice: currentPriceToString,
      zapBalance: zapBalanceToString,
      amtBalance: amtBalanceToString
    });
  }

  getCurrentPrice = async () => {
    const auxad = await AuxiliaryMarket.address;
    console.log(auxad);

    const currentPrice = await AuxiliaryMarket.methods.getCurrentPrice().call();

    console.log(currentPrice.toString());
  };

  getBalance = async _address => {
    const accounts = await web3.eth.getAccounts();

    const zapBalance = await AuxiliaryMarket.methods
      .getBalance(accounts[0])
      .call();

    this.state.zapBalance = zapBalance.toString();
    console.log(this.state.zapBalance);
    //console.log(zapBalance.toString());
  };

  getAMTBalance = async _owner => {
    const accounts = await web3.eth.getAccounts();

    const amtBalance = await AuxiliaryMarket.methods
      .getAMTBalance(accounts[0])
      .call();

    console.log(amtBalance.toString());
  };

  approve = async () => {
    const accounts = await web3.eth.getAccounts();

    await AuxiliaryMarketToken.methods
      .approve('0x90Cc8ff484fE2A1bABc5c100f96a4e5A53A84f21', '4000')
      .send({ from: accounts[0] })
      .then(receipt => console.log(receipt))
      .catch(err => console.log(err));
  };

  buy = async _quantity => {
    const accounts = await web3.eth.getAccounts();

    // const totalWeiZap =
    await AuxiliaryMarket.methods
      .buy('5000')
      .send({ from: accounts[0], gas: 126000 })
      .then(receipt => console.log(receipt))
      .catch(err => console.log(err));

    //console.log(totalWeiZap);
  };

  sell = async _quantity => {
    const accounts = await web3.eth.getAccounts();

    // const totalWeiZap =
    await AuxiliaryMarket.methods
      .sell('4000')
      .send({ from: accounts[0], gas: 300000 })
      .then(receipt => console.log(receipt))
      .catch(err => console.log(err));

    //console.log(totalWeiZap);
  };

  render() {
    return (
      <div className='App'>
        <h1>Asset Market</h1>
        <Button
          onClick={this.getCurrentPrice}
          variant='contained'
          color='primary'
        >
          getCurrentPrice()
        </Button>
        <h3>{this.state.currentPrice}</h3>
        <br />
        <br />
        <Button onClick={this.getBalance} variant='contained' color='primary'>
          getBalance()
        </Button>
        <h3>{this.state.zapBalance}</h3>
        <br />
        <br />
        <Button
          onClick={this.getAMTBalance}
          variant='contained'
          color='primary'
        >
          getAMTBalance()
        </Button>
        <h3>{this.state.amtBalance}</h3>
        <br />
        <br />
        <Button onClick={this.approve} variant='contained' color='primary'>
          approve()
        </Button>
        <br />
        <br />
        <Button onClick={this.buy} variant='contained' color='primary'>
          buy()
        </Button>
        <br />
        <br />
        <Button onClick={this.sell} variant='contained' color='primary'>
          sell()
        </Button>
      </div>
    );
  }
}

export default App;
