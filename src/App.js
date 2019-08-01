import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/landingPage/LandingPage';
import MainMarket from './pages/mainMarket/MainMarket';
import AuxMarket from './pages/auxiliaryMarket/AuxiliaryMarket';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import Button from '@material-ui/core/Button';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Switch>
        <Route path='/' exact component={LandingPage} />
        <Route path='/mainMarket' component={MainMarket} />
        <Route path='/auxMarket' component={AuxMarket} />
      </Switch>
    </Router>
  );
}

export default App;
