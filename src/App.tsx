import React from 'react'
import './App.css'
import {Route, HashRouter as Router, Switch, Redirect} from 'react-router-dom'
import Tabs from './components/tabs/Tabs'
import UserCenter from './pages/userCenter/UserCenter'
import Search from './pages/search/Search'
import TopList from './pages/topList/TopList'
import Singer from './pages/singer/Singer'
import Recommend from './pages/recommend/Recommend'
import Header from './components/header/Header'
import Player from './components/player/Player'
import useLoadLocalStorage from './utils/loadLocalStorage'

function App () {
    // 加载缓存的数据
    useLoadLocalStorage()
    return (
        <div className={'container'}>
            <Router>
                <Header/>
                <Tabs/>
                <div className={'router-wrap'}>
                    <Switch>
                        <Route exact path={'/user'} component={UserCenter}/>
                        <Route path="/recommend" component={Recommend}/>
                        <Route path="/singer" component={Singer}/>
                        <Route path="/topList" component={TopList}/>
                        <Route path="/search" component={Search}/>
                        <Redirect from={'/'} to={'/recommend'}/>
                    </Switch>
                </div>
                <Player/>
            </Router>
        </div>
    )
}

export default App
