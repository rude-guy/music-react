import React from 'react';
import './App.css';
import {Link, Route, HashRouter as Router, Switch} from 'react-router-dom'

function App() {
  return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about" >About</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <hr/>

          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route path="/about">
              <About/>
            </Route>
            <Route path="/dashboard">
              <Dashboard/>
            </Route>
          </Switch>
        </div>
      </Router>)
}

export default App;


function Home() {
  return (
      <div>
        <h2>Home</h2>
      </div>
  );
}

function About() {
  return (
      <div>
        <h2>About</h2>
      </div>
  );
}

function Dashboard() {
  return (
      <div>
        <h2>Dashboard</h2>
      </div>
  );
}
