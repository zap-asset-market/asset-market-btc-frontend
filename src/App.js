import React, { Component } from 'react';
import web3 from './web3.js';
import './App.css';
import Button from '@material-ui/core/Button';

import AuxiliaryMarket from './AuxiliaryMarket.js';

class App extends Component {
  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    const currentPrice = await AuxiliaryMarket.methods
      .getCurrentPrice()
      .call()
      .toString();

    console.log(currentPrice.toString());
  };

  render() {
    return (
      <div className='App'>
        <h1>Asset Market</h1>
        <Button onClick={this.onClick} variant='contained' color='primary'>
          getCurrentPrice()
        </Button>
      </div>
    );
  }
}

export default App;
