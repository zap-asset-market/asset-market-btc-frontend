import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
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
        <Route path='/MainMarket' component={MainMarket} />
        <Route path='/AuxiliaryMarket' component={AuxiliaryMarket} />
      </Switch>
    </Router>
  );
}

export default App;
