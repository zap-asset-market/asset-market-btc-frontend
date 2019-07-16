import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import web3 from './web3';
import MainMarket from './contracts/MainMarket'

async function bond() {
	const balance = await web3.eth.getBalance(MainMarket.options.address);
	console.log("balance: ", balance);

    const accounts = await web3.eth.getAccounts();

    console.log("accounts: ", accounts);
    
    // await MainMarket.methods.depositZap(20000).send({
    //   from: accounts[0]
    // });

    let zapBalance = await MainMarket.methods.getZapBalance(accounts[0]).call();
    console.log("zapBalance: ", zapBalance.toString());
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
