import React from 'react';
import './App.css';
import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom';
import KeepAlive, { AliveScope } from 'react-activation';
import Tabs from './components/tabs/Tabs';
import Header from './components/header/Header';
import useLoadLocalStorage from './utils/loadLocalStorage';
import Loading from './components/loading/Loading';

const UserCenter = React.lazy(() => import('./pages/userCenter/UserCenter'));
const Recommend = React.lazy(() => import('./pages/recommend/Recommend'));
const Singer = React.lazy(() => import('./pages/singer/Singer'));
const TopList = React.lazy(() => import('./pages/topList/TopList'));
const Search = React.lazy(() => import('./pages/search/Search'));
const Player = React.lazy(() => import('./components/player/Player'));

function App() {
  // 加载缓存的数据
  useLoadLocalStorage();
  return (
    <div className={'container'}>
      <Router>
        <AliveScope>
          <Header />
          <Tabs />
          <React.Suspense fallback={<Loading />}>
            <div className={'router-wrap'}>
              <Switch>
                <Route
                  exact
                  path={'/user'}
                  render={() => (
                      <UserCenter />
                  )}
                />
                <Route
                  path="/recommend"
                  render={() => (
                    <KeepAlive name={'Recommend'} id={'Recommend'}>
                      <Recommend />
                    </KeepAlive>
                  )}
                />
                <Route
                  path="/singer"
                  render={() => (
                    <KeepAlive name={'Singer'} id={'Singer'}>
                      <Singer />
                    </KeepAlive>
                  )}
                />
                <Route
                  path="/topList"
                  render={() => (
                    <KeepAlive name={'TopList'} id={'TopList'}>
                      <TopList />
                    </KeepAlive>
                  )}
                />
                <Route
                  path="/search"
                  render={() => (
                    <KeepAlive name={'KeepAlive'} id={'KeepAlive'}>
                      <Search />
                    </KeepAlive>
                  )}
                />
                <Redirect from={'/'} to={'/recommend'} />
              </Switch>
            </div>
            <Player />
          </React.Suspense>
        </AliveScope>
      </Router>
    </div>
  );
}

export default App;
