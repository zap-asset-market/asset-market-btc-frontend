import React, { useState, useEffect } from 'react';
import web3 from '../../web3.js';
import {
  Divider,
  Grid,
  Paper,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Typography,
  TextField
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { green, red, blue } from '@material-ui/core/colors';
import Header from '../layout/Header';
import AuxiliaryMarketContract from '../../ABI/AuxiliaryMarket.js';
import AuxiliaryMarketTokenContract from '../../ABI/AuxiliaryMarketToken';

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
  const [currentPrice, setCurrentPrice] = useState('current price');
  const [zapBalance, setZapBalance] = useState('zap balance');
  const [amtBalance, setAmtBalance] = useState('amt balance');
  const [values, setValues] = useState({
    currency: 'AMT'
  });

  const classes = useStyles();

  //TODO: allow user to display in MMTwei or MMT
  function getAMTBalance() {
    return 2000000;
  }

  // const getAMTBalance = async _owner => {
  //   const accounts = await web3.eth.getAccounts();

  //   const amtBalance = await AuxiliaryMarketContract.methods
  //     .getAMTBalance(accounts[0])
  //     .call();

  //   console.log(amtBalance.toString());
  // };

  function getZapBalance() {
    return 3000000;
  }

  // const getZapBalance = async _address => {
  //   const accounts = await web3.eth.getAccounts();

  //   var zapBalance = await AuxiliaryMarketContract.methods
  //     .getBalance(accounts[0])
  //     .call();

  //   zapBalance = zapBalance.toString();
  //   console.log(zapBalance);
  //   return 10;
  // };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const approve = async () => {
    const accounts = await web3.eth.getAccounts();

    await AuxiliaryMarketTokenContract.methods
      .approve('0x90Cc8ff484fE2A1bABc5c100f96a4e5A53A84f21', '4000')
      .send({ from: accounts[0] })
      .then(receipt => console.log(receipt))
      .catch(err => console.log(err));
  };

  const buy = async _quantity => {
    const accounts = await web3.eth.getAccounts();

    // const totalWeiZap =
    await AuxiliaryMarketContract.methods
      .buy('5000')
      .send({ from: accounts[0], gas: 126000 })
      .then(receipt => console.log(receipt))
      .catch(err => console.log(err));

    //console.log(totalWeiZap);
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
              <Button
                onClick={getZapBalance}
                color='primary'
                variant='contained'
              >
                Test
              </Button>
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
                    className={classes.textField}
                    value={values.currency}
                    onChange={handleChange('currency')}
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
                    value={values.amount}
                    onChange={handleChange('amount')}
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

/* <ThemeProvider theme={theme}>
      <div className='App'>
        <h1>Asset Market</h1>
        <Button variant='contained' color='primary'>
          getCurrentPrice()
        </Button>
        <h3>{currentPrice}</h3>
        <br />
        <br />
        <Button variant='contained' color='primary'>
          getBalance()
        </Button>
        <h3>{zapBalance}</h3>
        <br />
        <br />
        <Button variant='contained' color='primary'>
          getAMTBalance()
        </Button>
        <h3>{amtBalance}</h3>
        <br />
        <br />
        <Button variant='contained' color='primary'>
          approve()
        </Button>
        <br />
        <br />
        <Button variant='contained' color='primary'>
          buy()
        </Button>
        <br />
        <br />
        <Button variant='contained' color='primary'>
          sell()
        </Button>
      </div>
    </ThemeProvider> */
