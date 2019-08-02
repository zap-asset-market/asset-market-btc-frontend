import React, { useState, useEffect } from 'react';
import web3 from '../../web3.js';
import {
  Divider,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  MenuItem,
  Typography,
  TextField
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Header from '../layout/Header';
import AuxiliaryMarketContract from '../../ABI/AuxiliaryMarket.js';
import AuxiliaryMarketTokenContract from '../../ABI/AuxiliaryMarketToken';
import ZapTokenContract from '../../ABI/ZapToken';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  menu: {
    width: 200
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  blueBtn: {
    backgroundColor: '#54c9ff',
    '&:hover': {
      backgroundColor: '#48b0e0'
    }
  },
  greenBtn: {
    backgroundColor: '#3ed138',
    '&:hover': {
      backgroundColor: '#31b02c'
    }
  },
  redBtn: {
    backgroundColor: '#ff2e51',
    '&:hover': {
      backgroundColor: '#d92745'
    }
  }
}));

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'WEI',
    label: 'WEI'
  },
  {
    value: 'ETH',
    label: 'ETH'
  },
  {
    value: 'ZAP',
    label: 'ZAP'
  },
  {
    value: 'AMT',
    label: 'AMT'
  }
];

function AuxiliaryMarket() {
  const [zapBalance, setZapBalance] = useState('zap balance');
  const [amtBalance, setAmtBalance] = useState('amt balance');
  const [userAddress, setUserAddress] = useState('');
  const [values, setValues] = useState({
    currency: 'AMT',
    amount: ''
  });

  useEffect(() => {
    const initData = async () => {
      let userAddress = await getAddress();
      try {
        setUserAddress(userAddress);
        let amtBalance = await getAMTBalance();
        setAmtBalance(amtBalance);
        let zapBalance = await getZapBalance();
        setZapBalance(zapBalance);
      } catch (error) {
        console.error(error);
      }
    };
    initData();
  }, [userAddress]);

  const classes = useStyles();

  //TODO: allow user to display in MMTwei or MMT
  const getAMTBalance = async () => {
    const amtBalance = await AuxiliaryMarketContract.methods
      .getAMTBalance(userAddress)
      .call();

    return amtBalance.toString();
  };

  const getZapBalance = async () => {
    const zapBalance = await ZapTokenContract.methods
      .balanceOf(userAddress)
      .call();

    return zapBalance.toString();
  };

  const getAddress = async () => {
    let accounts = await web3.eth.getAccounts();
    return accounts[0];
  };

  // const getAMTBalance = async _owner => {
  //   const accounts = await web3.eth.getAccounts();

  //   const amtBalance = await AuxiliaryMarketContract.methods
  //     .getAMTBalance(accounts[0])
  //     .call();

  //   console.log(amtBalance.toString());
  // };

  // const getZapBalance = async _address => {
  //   const accounts = await web3.eth.getAccounts();

  //   var zapBalance = await AuxiliaryMarketContract.methods
  //     .getBalance(accounts[0])
  //     .call();

  //   zapBalance = zapBalance.toString();
  //   console.log(zapBalance);
  //   return 10;
  // };

  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log(values);
  };

  const approve = async () => {
    const accounts = await web3.eth.getAccounts();

    await AuxiliaryMarketTokenContract.methods
      .approve('0x90Cc8ff484fE2A1bABc5c100f96a4e5A53A84f21', '4000')
      .send({ from: accounts[0] })
      .then(receipt => console.log(receipt))
      .catch(err => console.log(err));
  };

  const buy = async () => {
    const accounts = await web3.eth.getAccounts();

    AuxiliaryMarketContract.methods
      .buy(values.amount)
      .send({ from: userAddress, gas: 6620000 });
    //.estimateGas({ from: userAddress })
    //.then(gasAmount => console.log(gasAmount));
    /*
      just mint zap to aux market contract
    */

    let amtBalance = await getAMTBalance();

    setAmtBalance(amtBalance);

    // await AuxiliaryMarketContract.methods
    //   .buy('5000')
    //   .send({ from: accounts[0], gas: 126000 })
    //   .then(receipt => console.log(receipt))
    //   .catch(err => console.log(err));
  };

  const sell = async _quantity => {
    const accounts = await web3.eth.getAccounts();

    // const totalWeiZap =
    await AuxiliaryMarketContract.methods
      .sell('4000')
      .send({ from: accounts[0], gas: 300000 })
      .then(receipt => console.log(receipt))
      .catch(err => console.log(err));

    //console.log(totalWeiZap);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='layout'>
        <Header transparent={false} />
        <Grid
          className='container'
          container
          spacing={2}
          justify='space-around'
        >
          <Grid item xs={12} sm={3}>
            <Paper>
              <List>
                <ListItem>
                  <Typography>AMT Balance: </Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{amtBalance}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>Zap Balance: </Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{zapBalance}</Typography>
                </ListItem>
              </List>
              <Divider light />
              <ListItem>
                <form className={classes.form}>
                  <TextField
                    id='standard-select-currency'
                    select
                    label='currency'
                    name='currency'
                    className={classes.textField}
                    value={values.currency}
                    onChange={handleChange} //('currency')
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                    helperText=''
                    margin='normal'
                  >
                    {currencies.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    id='standard-number'
                    label='Amount'
                    name='amount'
                    value={values.amount}
                    onChange={handleChange}
                    type='number'
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin='normal'
                  />
                </form>
              </ListItem>
              <ListItem>
                <Grid
                  container
                  justify='space-between'
                  alignItems='stretch'
                  spacing={1}
                >
                  <Grid item xs={6} lg={5}>
                    <Button
                      onClick={buy}
                      className={classes.greenBtn}
                      variant='contained'
                      fullWidth
                      style={{ height: '100%' }}
                    >
                      Buy AMT
                    </Button>
                  </Grid>
                  <Grid item xs={6} lg={5}>
                    <Button
                      onClick={sell}
                      className={classes.redBtn}
                      variant='contained'
                      fullWidth
                      style={{ height: '100%' }}
                    >
                      Sell AMT
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      className={classes.blueBtn}
                      variant='contained'
                      fullWidth
                      style={{ height: '100%' }}
                    >
                      Deposit Zap
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default AuxiliaryMarket;
