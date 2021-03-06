import React, { useState, useEffect } from 'react';
import web3 from '../../web3.js';
import MainMarketTokenContract from '../../ABI/MainMarketToken';
import MainMarketContract from '../../ABI/MainMarket.js';
import BondageContract from '../../ABI/Bondage';
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
import MainMarketChart from '../mainmarketChart/MainMarketChart';
import {Line} from 'react-chartjs-2';

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
  blueBtnTran: {
    backgroundColor: 'rgba(24, 175, 220, 0.2)',
    border: '1px solid rgb(24, 175, 220)',
    '&:hover': {
      backgroundColor: 'rgba(24, 175, 220, 0.4)'
    },
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
    mmtAmount: '',
    depositAmount: '',  //amount user want to buy
    withdrawAmount: ''
  });
  const [userAddress, setUserAddress] = useState('');
  const [mmtBal, setMmtBalance] = useState(0);
  const [depositedZap, setDepositedBalance] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [issuedDots, setIssuedDots] = useState(0); //the amount of dots that generated by main market
  const [dotData, setDotData] = useState([]);

  const classes = useStyles();

  async function getAddress () {
    let accounts = await web3.eth.getAccounts();
    // setValues({values, 'userAddress': accounts[0]});
    setUserAddress(accounts[0])
    // return accounts[0];
  }

  async function depositZap(){
        if (values.depositAmount === '') return;

    let amountInWei = web3.utils.toWei(values.depositAmount, 'ether')

    try {
      //approve zap in order to deposit to main market
      await ZapTokenContract.methods
        .approve(MainMarketContract.options.address, amountInWei)
        .send({from: userAddress, gas:400000});

      //tranfer zap to main market
      await MainMarketContract.methods
        .depositZap(amountInWei)
        .send({ from: userAddress })
      
      //update new zapbalance
      await getZapBalance();
    } catch (error) {
      console.log(error);
    }
  }

  async function withdrawFunds(){
    if (values.withdrawAmount === '') return;
    let amountInWei = web3.utils.toWei(values.withdrawAmount, 'ether')

    try {
      await MainMarketContract.methods.withdrawFunds(amountInWei).send({from: userAddress, gas: 400000}); 
      //update new zapbalance
      await getZapBalance();
    }catch (error) {
      console.log(error);
    }

  }

  //users mmt balance
  async function getMMTBalance() {
    if (userAddress === '') {
      console.log("user addres not set");
      return
    }
    try {
      let mmtBal = await MainMarketContract.methods.getMMTBalance(userAddress).call();
      setMmtBalance(mmtBal);
    } catch(error) {
      console.log(error);
    }
    // return mmtBal.toString()
  }

  async function getTotalBonded() {
    let mmAddres = MainMarketContract.options.address;
    let endPoint = await MainMarketContract.methods.endPoint().call();
    let totalBonded = await BondageContract.methods.getDotsIssued(mmAddres, endPoint).call(); 
    setIssuedDots(totalBonded);
  }


  //return amount of zap user can spend in main market / amount of zap deposited in main market
  async function getZapBalance() {
    let deposited = await MainMarketContract.methods.getDepositedZap().call();
    // convert from weizap to zap
    let depositedInZap = web3.utils.fromWei(deposited, 'ether');
    setDepositedBalance(depositedInZap);
    // return depositedInZap;
  }

  async function sellMMT() {
    try {
      //first approve main market to tranfer main market token
      await MainMarketTokenContract.methods
      .approve(MainMarketContract.options.address,values.mmtAmount)
      .send({from: userAddress, gas: 1000000});

      //sell the mmt
      await MainMarketContract.methods.unbond(values.mmtAmount).send({from: userAddress, gas: 1000000});

      //update the state
      await getMMTBalance();
      await getZapBalance();
    }catch (error) {
      console.log(error);
    }
  }

  async function buyMMT() {
    try {
      await MainMarketContract.methods
      .bond(values.mmtAmount).send({from: userAddress, gas: 1000000})
      // update mmtBal
      await getMMTBalance();
      // deposit balance should've decreased
      await getZapBalance();
    }catch (error) {
      console.log(error);
    }
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    const initData = async () => {
      await getAddress();
      await getMMTBalance();
      await getTotalBonded();
      await getZapBalance();
      await parseCurveToData();
    }
    initData();
  }, [userAddress, mmtBal, issuedDots, depositedZap ]);

  // this take care of updating the price
  useEffect(() => {
    console.log("second use effect");
    MainMarketContract.methods.zapForDots(values.mmtAmount).call()
      .then((orderTotal) => {
        console.log("orderTotal: ", orderTotal);
        setOrderTotal(orderTotal);
      }
      );
  }, [values.mmtAmount]);

  const data = {
  datasets: [
    {
      label: 'Bonding price',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(24, 175, 220, 0.1)',
      borderColor: 'rgba(24, 175,  220, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: dotData
    },
  ],
};
const options = {
    scales: {
      xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            suggestedMax: 1000
          }
      }],
      yAxes: [{
        ticks: {
            suggestedMin: 0,
            suggestedMax: 8
        }
      }]
    },
    offset: true
  }


  // given a number and and array of coefficents returns the output
  // example if coeff = [3,1,5] it will calculate: num*3^0 + num*1^1 + num*5^2
  // As you can see the index presents the exponent
  function calculatePol (num, coeff) {
    let result = 0;
    for (let i = 0; i < coeff.length; i++) { 
      result = result + coeff[i] * num**i;
    }
    return result;
  }

  async function parseCurveToData() {
    let doneWithData = false; 
    let curve = await MainMarketContract.methods.getCurve().call();
    curve = curve.map(n => Number(n));
    let data = [];

    let start = 0; //graph start with x = 0;
    for (let i = 0; i < curve.length;) {
      let upperBound = curve[i + curve[i] + 1];
      let upperSlice = i + curve[i] + 1; //number where we need to slice to get coefficients
      let coeff = curve.slice(i+1, upperSlice); //are of only the coeffcients

      for (let j = start; j < upperBound; j++) {
        //only diplay up to the current total bonded dots
        if (j > issuedDots) {
          doneWithData = true;
          break;
        }

        let value = calculatePol(j, coeff);
        let dataObject = {
          x: j,
          y: value
        }
        data.push(dataObject);
      }
      if (doneWithData) {break}

      i =  i + curve[i] + 2;
      start = upperBound;
    }
    setDotData(data);
    // displayChart(data);
  }
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
                  <Typography variant='caption'>{mmtBal}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>Equity</Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{mmtBal / issuedDots * 100}%</Typography>
                </ListItem>
                <ListItem>
                  <Typography>zap bal: </Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{depositedZap}</Typography>
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
                  <Typography>order total: {orderTotal}</Typography>
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
                        Bond
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
                        Unbond
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider light />
                    </Grid>
                    
                  </Grid>
                </ListItem>
                <ListItem>
                  <TextField
                    id='standard-number'
                    label='deposit Amount'
                    placeholder='0'
                    value={values.depositAmount}
                    onChange={handleChange('depositAmount')}
                    type='number'
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin='normal'
                  />
                </ListItem>
                <ListItem>
                  <Button
                    className={classes.blueBtn}
                    variant='contained'
                    fullWidth
                    style={{ height: '100%' }}
                    onClick={depositZap}
                  >
                    Deposit Zap
                  </Button>
                </ListItem>

                <Divider light />

                <ListItem>
                  <TextField
                    id='standard-number'
                    label='withdraw amount'
                    placeholder='0'
                    value={values.withdrawAmount}
                    onChange={handleChange('withdrawAmount')}
                    type='number'
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin='normal'
                  />
                </ListItem>
                <ListItem>
                  <Button
                    className={classes.blueBtnTran}
                        variant='contained'
                        fullWidth
                        style={{ height: '100%' }}
                        onClick={withdrawFunds}
                      >
                        withdraw zap
                      </Button>
                </ListItem>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper>
              <Line data={data} options={options}/>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default MainMarket;