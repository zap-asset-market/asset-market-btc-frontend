import React, { useState, useEffect } from 'react';
import web3 from '../../web3.js';
import fromExponential from 'from-exponential';
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
  // {
  //   value: 'USD',
  //   label: '$'
  // },
  // {
  //   value: 'BTC',
  //   label: '฿'
  // },
  // {
  //   value: 'WEI',
  //   label: 'WEI'
  // },
  // {
  //   value: 'ETH',
  //   label: 'ETH'
  // },
  // {
  //   value: 'ZAP',
  //   label: 'ZAP'
  // },
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
  const [btcZAP, setBtcZAP] = useState('--');
  const [ethZAP, setEthZAP] = useState('--');
  const [usdZAP, setUsdZAP] = useState('--');
  const [evs, setEvs] = useState({});

  const [values, setValues] = useState({
    currency: 'AMT',
    amount: ''
  });

  useEffect(() => {
    const initData = async () => {
      let userAddress = await getAddress();
      try {
        AuxiliaryMarketContract.getPastEvents(
          'Results',
          { fromBlock: 0, toBlock: 'latest' },
          (error, events) => {
            if (error) {
              console.log(error);
            } else {
              let newEvent = evs;
              newEvent['results'] = events[events.length - 1].returnValues;
              setEvs(newEvent);

              setUsdZAP(evs.results.zapInUsd);
              setZapUSD(1 / evs.results.zapInUsd);
              setEthZAP(web3.utils.fromWei(evs.results.zapInWei, 'ether'));
              setZapETH(1 / web3.utils.fromWei(evs.results.zapInWei, 'ether'));
              setZapBTC(
                web3.utils.fromWei(evs.results.assetInWei, 'ether') /
                  web3.utils.fromWei(evs.results.zapInWei, 'ether')
              );
              let bitzap =
                web3.utils.fromWei(evs.results.zapInWei, 'ether') /
                web3.utils.fromWei(evs.results.assetInWei, 'ether');

              setBtcZAP(fromExponential(bitzap));
            }
          }
        );

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
  }, [userAddress, zapBalance, amtBalance, usdZAP, evs]);

  const classes = useStyles();

  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
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
    let amount = web3.utils.toWei(values.amount, 'ether');

    let gas = await AuxiliaryMarketContract.methods
      .buy(amount)
      .estimateGas({ from: userAddress });

    await AuxiliaryMarketContract.methods
      .buy(amount)
      .send({ from: userAddress, gas });

    setAmtBalance('processing transaction...');
    setZapBalance('processing transaction...');

    AuxiliaryMarketContract.once(
      'Bought',
      { fromBlock: 'latest' },
      (error, events) => {
        if (error) {
          console.log(error);
        } else {
          var amt = web3.utils.fromWei(events.returnValues.amt, 'ether');
          setAmtBalance(amt);
        }
      }
    );

    AuxiliaryMarketContract.events.Results(
      { fromBlock: 'latest' },
      (error, events) => {
        if (error) {
          console.log(error);
        } else {
          setUsdZAP(events.returnValues.zapInUsd);
          setZapUSD(1 / events.returnValues.zapInUsd);
          setEthZAP(web3.utils.fromWei(events.returnValues.zapInWei, 'ether'));
          setZapETH(
            1 / web3.utils.fromWei(events.returnValues.zapInWei, 'ether')
          );
          setZapBTC(
            web3.utils.fromWei(events.returnValues.assetInWei, 'ether') /
              web3.utils.fromWei(events.returnValues.zapInWei, 'ether')
          );
          let bitzap =
            web3.utils.fromWei(events.returnValues.zapInWei, 'ether') /
            web3.utils.fromWei(events.returnValues.assetInWei, 'ether');

          setBtcZAP(fromExponential(bitzap));
        }
      }
    );
  };

  const sell = async () => {
    let amount = web3.utils.toWei(values.amount, 'ether');

    let approvedAmount = amount + '0';

    await AuxiliaryMarketTokenContract.methods
      .approve(AuxiliaryMarketContract.options.address, approvedAmount)
      .send({
        from: userAddress,
        gas: 400000
      });

    let gas = await AuxiliaryMarketContract.methods
      .sell(amount)
      .estimateGas({ from: userAddress });

    await AuxiliaryMarketContract.methods.sell(amount).send({
      from: userAddress,
      gas
    });

    setAmtBalance('processing transaction...');
    setZapBalance('processing transaction...');

    AuxiliaryMarketContract.once(
      'Sold',
      { fromBlock: 'latest' },
      (error, events) => {
        if (error) {
          console.log(error);
        } else {
          var amt = web3.utils.fromWei(events.returnValues.amt, 'ether');
          setAmtBalance(amt);
        }
      }
    );

    AuxiliaryMarketContract.events.Results(
      { fromBlock: 'latest' },
      (error, events) => {
        if (error) {
          console.log(error);
        } else {
          setUsdZAP(events.returnValues.zapInUsd);
          setZapUSD(1 / events.returnValues.zapInUsd);
          setEthZAP(web3.utils.fromWei(events.returnValues.zapInWei, 'ether'));
          setZapETH(
            1 / web3.utils.fromWei(events.returnValues.zapInWei, 'ether')
          );
          setZapBTC(
            web3.utils.fromWei(events.returnValues.assetInWei, 'ether') /
              web3.utils.fromWei(events.returnValues.zapInWei, 'ether')
          );
          let bitzap =
            web3.utils.fromWei(events.returnValues.zapInWei, 'ether') /
            web3.utils.fromWei(events.returnValues.assetInWei, 'ether');

          setBtcZAP(fromExponential(bitzap));
        }
      }
    );
  };
  console.log(evs);
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
          <Grid container spacing={5}>
            <Grid item xs>
              <Paper className={classes.paper}>
                <h2>BTC/ZAP</h2>
                <Divider light />
                <div style={{ padding: 25 }}>{btcZAP}</div>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>
                <h2>ETH/ZAP</h2>
                <Divider light />
                <div style={{ padding: 25 }}>{ethZAP}</div>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>
                <h2>USD/ZAP</h2>
                <Divider light />
                <div style={{ padding: 25 }}>{usdZAP}</div>
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
                  label='currency'
                  name='currency'
                  className={classes.textField}
                  placeholder='0'
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
