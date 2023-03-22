import React, { useEffect, useState } from 'react';
import styles from './TopList.module.css';
import Scroll from '../../components/scroll/Scroll';
import { getTopList } from '../../services/topList';
import { useLoadScroll } from '../../utils/hooks';
import storage from 'good-storage';
import { TOP_KEY } from '../../assets/ts/constant';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import TopDetail from './topDetail/TopDetail';
import Loading from '../../components/loading/Loading';

export interface TopSong {
  id: number;
  singerName: string;
  songName: string;
}

export interface TopListParams {
  id: number;
  name: string;
  period: string;
  pic: string;
  songList: TopSong[];
}

const TopList = () => {
  const [topList, setTopList] = useState<TopListParams[]>([]);

  const { path, url } = useRouteMatch();
  const history = useHistory();

  const { scrollRef, playListStyle } = useLoadScroll(topList);

  /**
   * 初始化TopList数据
   */
  useEffect(() => {
    getTopList().then((res) => {
      setTopList(res.topList);
    });
  }, []);

  /**
   * 选择对应排行
   * @param item
   */
  const selectItem = (item: TopListParams) => {
    storage.session.set(TOP_KEY, item);
    console.log(`${url}/${item.id}`);
    history.push(`${url}/${item.id}`);
  };

  return (
    <>
      {topList.length ? (
        <div className={styles.topList} style={playListStyle}>
          <Scroll className={styles.topListContent} ref={scrollRef}>
            <ul>
              {' '}
              {topList.map((tops) => (
                <li className={styles.item} key={tops.id} onClick={() => selectItem(tops)}>
                  <div className={styles.icon}>
                    <img src={tops.pic} alt="alt" width={'100'} height={'100'} />
                  </div>
                  <ul className={styles.songList}>
                    {' '}
                    {tops.songList.map((song, index) => (
                      <li className={styles.song} key={song.songName}>
                        <span>{index + 1}. </span>
                        <span>
                          {song.songName}-{song.singerName}
                        </span>
                      </li>
                    ))}{' '}
                  </ul>
                </li>
              ))}{' '}
            </ul>
          </Scroll>
        </div>
      ) : (
        <Loading />
      )}
      <Switch>
        <Route path={`${path}/:topListId`} component={TopDetail} />
      </Switch>
    </>
  );
};

export default TopList;
