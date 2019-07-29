import React from 'react';
import Header from './components/header/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LandingPage from './pages/landingPage/LandingPage';
import MainMarket from './pages/mainMarket/MainMarket';
import AuxMarket from './pages/auxiliaryMarket/Auxiliary';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';


function App() {
  return (

  	<Router>
  		<CssBaseline/>
    	<Switch>
    		<Route path='/' exact component={LandingPage}/>
    		<Route path='/mainMarket' component={MainMarket}/>
    		<Route path='/auxMarket' component={AuxMarket}/>
    	</Switch>
	</Router>
  );
}

export default App;
