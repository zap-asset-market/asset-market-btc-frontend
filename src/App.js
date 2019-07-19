import React from 'react';
import web3 from './web3';
import ZapToken from "./contracts/ZapToken";
import AuxiliaryMarket from './contracts/AuxiliaryMarket';
import MainMarket from './contracts/MainMarket';
// import MainMarketToken from './contracts/MainMarketToken';
import './App.css';
//material ui imports
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let accounts = await web3.eth.getAccounts();

    console.log("accounts: ", accounts);
    let amtBal = await AuxiliaryMarket.methods.getAMTBalance(accounts[0]).call();
    console.log("amtBal: ", amtBal.toString());

    console.log("auxiliary address: ", AuxiliaryMarket.address);
    console.log("zap address: ", ZapToken.address);

    let zapAllow = await ZapToken.methods.allowance(accounts[0], AuxiliaryMarket.address).call();
    console.log("zapAllow: ", zapAllow);
  }

  bondMM = async () => {
    let accounts = await web3.eth.getAccounts();
    console.log("accounts: ", accounts);

    // let mmtBal = await MainMarket.methods.getMMTBalance(accounts[0]).call();
    // let mMmmtBal = await MainMarket.methods.getMMTBalance(MainMarket.options.address).call();
    // // let allowance = await MainMarketToken.methods.allowance(accounts[0], MainMarket.options.address);
    // console.log("mmtBal: ", mmtBal.toString());
    // console.log("MMmmtBal: ", mMmmtBal.toString());

    MainMarket.methods.bond(8).send({from: accounts[0]})
    .then(console.log);
  }

  buyAmt = async () => {
    let accounts = await web3.eth.getAccounts();
    console.log("accounts: ", accounts);


    let amtBal = await AuxiliaryMarket.methods.getAMTBalance(accounts[0]).call();
    console.log("amtBal: ", amtBal.toString());

    await AuxiliaryMarket.methods.buy(8).send({from: accounts[0]}, (error, results) => {
      console.log(results);
      console.log(error);
    });
  }

    sellAmt = async () => {
      let accounts = await web3.eth.getAccounts();

      await AuxiliaryMarket.methods.sell(3).send({from: accounts[0]}, (error, results) => {
      console.log(results);
      console.log(error);
    });    }

  render() {
    return (
      <React.Fragment>
        <CssBaseline/>
        <div className="App"> 
          <AppBar position="static">
            <h1 className="title">Asset Market</h1>
            <Toolbar>
            {markets.map(market => (
              <Link
                color="inherit"
                noWrap
                key={market}
                href="#"
                className="NavBarLink"
              >
                {market}
              </Link>
            ))}
            </Toolbar>
          </AppBar>
          <Button variant='contained' color="primary" onClick=
          {this.buyAmt}>Buy AMT</Button>
          <Button variant='contained' color="primary" onClick=
          {this.sellAmt}>sell AMT</Button>
          <Button variant='contained' color="primary" onClick=
          {this.bondMM}>bond to main market</Button>
        </div>
      </React.Fragment>
    );
  }
}

const markets = [
  'Main Market',
  'Auxiliary Market',
];

export default App;
