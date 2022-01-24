import React from 'react'
import './App.css'
import {Route, HashRouter as Router, Switch, Redirect} from 'react-router-dom'
import Tabs from './components/tabs/Tabs'
import Header from './components/header/Header'
import useLoadLocalStorage from './utils/loadLocalStorage'
import Loading from './components/loading/Loading'

const UserCenter = React.lazy(() => import('./pages/userCenter/UserCenter'))
const Recommend = React.lazy(() => import('./pages/recommend/Recommend'))
const Singer = React.lazy(() => import('./pages/singer/Singer'))
const TopList = React.lazy(() => import('./pages/topList/TopList'))
const Search = React.lazy(() => import('./pages/search/Search'))
const Player = React.lazy(() => import('./components/player/Player'))

function App () {
    // 加载缓存的数据
    useLoadLocalStorage()
    return (
        <div className={'container'}>
            <Router>
                <Header/>
                <Tabs/>
                <React.Suspense fallback={<Loading/>}>
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
                </React.Suspense>
            </Router>
        </div>
    )
}

export default App
