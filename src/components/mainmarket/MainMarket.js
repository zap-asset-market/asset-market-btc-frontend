import React, { useState } from 'react';
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
    type: 'dark'
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
  const [mmThemeProvidertBalance, setMMtBalance] = useState(getMMTBalance);
  const [values, setValues] = React.useState({
    currency: 'mmt'
  });

  const classes = useStyles();

  //TODO: allow user to display in MMTwei or MMT
  function getMMTBalance() {
    return 2000000;
  }

  function getZapBalance() {
    return 3000000;
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
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
                  <Typography>MMT Balance</Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{getMMTBalance()}</Typography>
                </ListItem>
                <ListItem>
                  <Typography>zap bal: </Typography>
                  <div className={classes.grow} />
                  <Typography variant='caption'>{getZapBalance()}</Typography>
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
                      Buy MMT
                    </Button>
                  </Grid>
                  <Grid item xs={6} lg={5}>
                    <Button
                      className={classes.redBtn}
                      variant='contained'
                      fullWidth
                      style={{ height: '100%' }}
                    >
                      Sell MMT
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      className={classes.blueBtn}
                      variant='contained'
                      fullWidth
                      style={{ height: '100%' }}
                    >
                      Depoisit Zap
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
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
