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
  paper: {
    marginBottom: 25,
    textAlign: 'center'
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
  const [userAddress, setUserAddress] = useState('');
  const [zapBalance, setZapBalance] = useState('Loading...');
  const [amtBalance, setAmtBalance] = useState('Loading...');
  const [zapBTC, setZapBTC] = useState('--');
  const [zapETH, setZapETH] = useState('--');
  const [zapUSD, setZapUSD] = useState('--');
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
  }, [userAddress, zapBalance, amtBalance]);

  const classes = useStyles();

  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const timeout = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const getAddress = async () => {
    let accounts = await web3.eth.getAccounts();
    return accounts[0];
  };

  //TODO: allow user to display in MMTwei or MMT
  const getAMTBalance = async () => {
    const amtBalance = await AuxiliaryMarketContract.methods
      .getAMTBalance(userAddress)
      .call();

    let amt = web3.utils.fromWei(amtBalance, 'ether');

    return amt;
  };

  const getZapBalance = async () => {
    const zapBalance = await ZapTokenContract.methods
      .balanceOf(userAddress)
      .call();

    let zap = web3.utils.fromWei(zapBalance, 'ether');

    return zap;
  };

  const buy = async () => {
    await AuxiliaryMarketContract.methods
      .buy(values.amount)
      .send({ from: userAddress, gas: 6620000 });
    //.estimateGas({ from: userAddress })
    //.then(gasAmount => console.log(gasAmount));
    setAmtBalance('processing transaction...');

    // await timeout(5000);

    const amtBalance = await AuxiliaryMarketContract.methods
      .getAMTBalance(userAddress)
      .call();

    let amt = web3.utils.fromWei(amtBalance, 'ether');

    console.log(amt);

    setAmtBalance(amt);
  };

  const sell = async () => {
    let approvedAmount = values.amount + '0';
    console.log(AuxiliaryMarketContract.options.address);
    await AuxiliaryMarketTokenContract.methods
      .approve(AuxiliaryMarketContract.options.address, approvedAmount)
      .send({
        from: userAddress,
        gas: 400000
      });
    await AuxiliaryMarketContract.methods.sell(values.amount).send({
      from: userAddress,
      gas: 400000
    });
    // .estimateGas({ from: userAddress })
    //   .then(gasAmount => console.log(gasAmount));
    //await timeout(4000);

    const amtBalance = await AuxiliaryMarketContract.methods
      .getAMTBalance(userAddress)
      .call();

    let amt = web3.utils.fromWei(amtBalance, 'ether');
    console.log(amt);

    setAmtBalance(amt);
    // await AuxiliaryMarketContract.methods
    //   .sell('4000')
    //   .send({ from: accounts[0], gas: 300000 })
    //   .then(receipt => console.log(receipt))
    //   .catch(err => console.log(err));
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
          <Grid container spacing={5}>
            <Grid item xs>
              <Paper className={classes.paper}>
                <h2>ZAP/BTC</h2>
                <Divider light />
                <div style={{ padding: 25 }}>{zapBTC}</div>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>
                <h2>ZAP/ETH</h2>
                <Divider light />
                <div style={{ padding: 25 }}>{zapETH}</div>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>
                <h2>ZAP/USD</h2>
                <Divider light />
                <div style={{ padding: 25 }}>{zapUSD}</div>
              </Paper>
            </Grid>
          </Grid>

          {/* <Grid item xs={10} sm={3}> */}
          <Paper>
            <List>
              <ListItem>
                <Typography>AMT: </Typography>
                <div className={classes.grow} />
                <Typography variant='caption'>{amtBalance}</Typography>
              </ListItem>
              <ListItem>
                <Typography>ZAP: </Typography>
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
                  label='Currency'
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
                  label='Amount In Wei'
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
                <Grid item xs={12} />
              </Grid>
            </ListItem>
          </Paper>
          {/* </Grid> */}
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default AuxiliaryMarket;
