import React from 'react'
import './App.css'
import {Route, HashRouter as Router, Switch, Redirect} from 'react-router-dom'
import Tabs from './components/tabs/Tabs'
import Search from './pages/search/Search'
import TopList from './pages/topList/TopList'
import Singer from './pages/singer/Singer'
import Recommend from './pages/recommend/Recommend'
import Header from './components/header/Header'
import Player from './components/player/Player'

function App () {
    return (
        <div className={'container'}>
            <Router>
                <Header/>
                <Tabs/>
                <div className={'router-wrap'}>
                    <Switch>
                        <Route path="/recommend" component={Recommend}/>
                        <Route path="/singer" component={Singer} />
                        <Route exact path="/topList" component={TopList}/>
                        <Route exact path="/search" component={Search} />
                        <Redirect from={'/'} to={'/recommend'}/>
                    </Switch>
                </div>
                <Player />
            </Router>
        </div>
    )
}

export default App
