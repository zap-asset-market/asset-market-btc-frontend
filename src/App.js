import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import web3 from './web3';
import MainMarket from './contracts/MainMarket';
import MainMarketToken from './contracts/MainMarketToken';

async function bond() {
	let accounts = await web3.eth.getAccounts();

    let mmZap = await MainMarket.methods.getZapBalance(MainMarket.options.address).call();
    console.log("main market zap: ", mmZap.toString());

    let mmtBal = await MainMarket.methods.getMMTBalance(accounts[0]).call();
    let mMmmtBal = await MainMarket.methods.getMMTBalance(MainMarket.options.address).call();
    // let allowance = await MainMarketToken.methods.allowance(accounts[0], MainMarket.options.address);
    console.log("mmtBal: ", mmtBal.toString());
    console.log("MMmmtBal: ", mMmmtBal.toString());

    await MainMarket.methods.bond('5').send({from: accounts[0]});

}

function App() {
  return (
    <div className="App">
      <h1>Asset Market</h1>
      <Button variant='contained' color="primary" onClick=
      {bond}>Buy AMT</Button>
    </div>
  );
}

export default App;
