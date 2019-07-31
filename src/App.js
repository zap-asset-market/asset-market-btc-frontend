import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Header from './components/layout/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './components/pages/landingPage/LandingPage';
import MainMarket from './components/mainmarket/MainMarket';
import AuxiliaryMarket from './components/auxiliarymarket/AuxiliaryMarket';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Switch>
        <Route path='/' exact component={LandingPage} />
        <Route path='/mainMarket' component={MainMarket} />
        <Route path='/auxMarket' component={AuxiliaryMarket} />
      </Switch>
    </Router>
  );
}

export default App;
