import React from 'react'
import './App.css'
import { Route, HashRouter as Router, Switch} from 'react-router-dom'
import Tabs from './components/tabs/Tabs'
import Search from './pages/search/Search'
import TopList from './pages/topList/TopList'
import Singer from './pages/singer/Singer'
import Recommend from './pages/recommend/Recommend'
import Header from './components/header/Header'

function App () {
    return (
        <div className={'container'}>
            <Router>
                <Header/>
                <Tabs/>
                <div>
                    <Switch>
                        <Route exact path="/recommend">
                            <Recommend/>
                        </Route>
                        <Route exact path="/singer">
                            <Singer/>
                        </Route>
                        <Route exact path="/topList">
                            <TopList/>
                        </Route>
                        <Route exact path="/search">
                            <Search/>
                        </Route>
                        <Route path="*" component={Recommend}/>
                    </Switch>
                </div>
            </Router>
        </div>
    )
}

export default App
