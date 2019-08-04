import React, { useState, useEffect } from 'react';
import web3 from '../../web3.js';
import MainMarketTokenContract from '../../ABI/MainMarketToken';
import MainMarketContract from '../../ABI/MainMarket.js';
import ZapTokenContract from '../../ABI/ZapToken.js';
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
    type: 'dark',
  }
});

// const BtnTheme = createMuiTheme({
//   palette: {
//      primary: green,
//      secondary: red,
//      other:
//   },
// });

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
    value: 'wei',
    label: 'wei'
  },
  {
    value: 'eth',
    label: 'eth'
  },
  {
    value: 'zap',
    label: 'zap'
  },
  {
    value: 'mmt',
    label: 'mmt'
  }
];

function MainMarket() {  
  //state of inputs
  const [values, setValues] = useState({
    currency: 'mmt',
    mmtAmount: "",
    mmtBal: 0,
    zapAmount: "",  //amount user want to buy
    depositedZap: 0, //zap user has in the exchange
    userAddress: ""
  });

  const classes = useStyles();

  async function getAddress () {
    let accounts = await web3.eth.getAccounts();
    return accounts[0];
  }
  async function depositZap(){
    const accounts = await web3.eth.getAccounts();

    let amountInWei = web3.utils.toWei(values.zapAmount, 'ether')

    try {
      //approve zap in order to deposit to main market
      await ZapTokenContract.methods
        .approve(MainMarketContract.options.address, amountInWei)
        .send({from: accounts[0], gas:400000});

      //tranfer zap to main market
      await MainMarketContract.methods
        .depositZap(amountInWei)
        .send({ from: accounts[0] })
    } catch (error) {
      console.log(error);
    }

    //update new zapbalance
    let depositedZap = await getZapBalance();
    setValues({...values, depositedZap: depositedZap});
  }

  //users mmt balance
  async function getMMTBalance() {
    console.log("userAddress: ", values.userAddress);
    let mmtBal = await MainMarketContract.methods.getMMTBalance(values.userAddress).call();
    return mmtBal.toString()
  }


  //return amount of zap user can spend in main market / amount of zap deposited in main market
  async function getZapBalance() {
    let deposited = await MainMarketContract.methods.getDepositedZap().call();
    // convert from weizap to zap
    let depositedInZap = web3.utils.fromWei(deposited, 'ether');
    return depositedInZap;
  }

  async function sellMMT() {
    console.log("selling mmt");
    try {
      //first approve main market to tranfer main market token
      await MainMarketTokenContract.methods
      .approve(MainMarketContract.options.address,values.mmtAmount)
      .send({from: values.userAddress, gas: 1000000});

      console.log("approve successful");
      //sell the mmt
      await MainMarketContract.methods.unbond(values.mmtAmount).send({from: values.userAddress, gas: 1000000});

      //update the state
      //mmt should be less
      let mmtBal = await getMMTBalance();

      //zap balance should be more
      let depositedZap = await getZapBalance();
      setValues({...values, 'mmtBal': mmtBal, 'depositedZap': depositedZap});
    } catch (error) {
      console.log(error);
    }
  }

  async function buyMMT() {
    try {
      await MainMarketContract.methods
      .bond(values.mmtAmount).send({from: values.userAddress, gas: 1000000})
      // update mmtBal
      let mmtBal = await getMMTBalance();
      // deposit balance should've decreased
      let depositedZap = await getZapBalance();
      setValues({...values, 'mmtBal': mmtBal, 'depositedZap': depositedZap});
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    
    const initData = async () => {
      let userAddress = await getAddress();
      //before anything we need to get the address
      console.log("userAddress: ", userAddress);
      setValues({...values, 'userAddress': userAddress});
      console.log("values: ", values);
      try {
        let results = await Promise.all([getMMTBalance(), getZapBalance()])
        setValues({ 
          ...values,
          'mmtBal':results[0],
          'depositedZap': results[1]
        });
      } catch (error) {
        console.log(error);
      }
    }
    initData();
  }, [values.userAddress]);

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
                  <Typography>MMT Balance</Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{values.mmtBal}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>zap bal: </Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{values.depositedZap}</Typography>
                </ListItem>
              </List>

              <Divider light />
              
              <form className={classes.form}>
                <ListItem>
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
                      placeholder='0'
                      value={values.mmtAmount}
                      onChange={handleChange('mmtAmount')}
                      type='number'
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true
                      }}
                      margin='normal'
                    />
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
                        onClick={buyMMT}
                      >
                        Buy MMT/Bond
                      </Button>
                    </Grid>
                    <Grid item xs={6} lg={5}>
                      <Button
                        className={classes.redBtn}
                        variant='contained'
                        fullWidth
                        style={{ height: '100%' }}
                        onClick={sellMMT}
                      >
                        Sell MMT
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider light />
                    </Grid>
                    <ListItem>
                      <TextField
                        id='standard-number'
                        label='zap Amount'
                        placeholder='0'
                        value={values.zapAmount}
                        onChange={handleChange('zapAmount')}
                        type='number'
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin='normal'
                      />
                    </ListItem>

                    <Grid item xs={12}>
                      <Button
                        className={classes.blueBtn}
                        variant='contained'
                        fullWidth
                        style={{ height: '100%' }}
                        onClick={depositZap}
                      >
                        Depoisit Zap
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper>show curve</Paper>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default MainMarket;
