import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Suggest.module.css';
import { useDebounce } from '../../../utils/public';
import { search } from '../../../services/search';
import { Song } from '../../../pages/singer/singerDetail/SingerDetail';
import { processSongs } from '../../../services/song';
import Loading from '../../loading/Loading';
import { SingerInfo } from '../../../pages/singer/Singer';
import usePullLoad from './usePullLoad';
import { nextTick } from '../../../utils/hooks';
import NoResult from '../../noResult/NoResult';

/*
 * Suggest组件Props
 */
interface Props {
  query: string;
  showSinger?: boolean;
  selectItemSong: (song: Song) => void;
  selectItemSinger?: (singer: SingerInfo) => void;
}

const Suggest: React.FC<Props> = ({ query, showSinger = true, selectItemSong, selectItemSinger }) => {
  const debouncedQuery = useDebounce(query, 300);
  // 搜索歌曲列表
  const [songs, setSongs] = useState<Song[]>([]);
  const [singer, setSinger] = useState<SingerInfo | null>(null);
  // 分页页码
  const page = useRef(0);
  // 是否有更多数据
  const [hasMore, setHasMore] = useState(true);
  // 是否手动刷新
  const [manualLoading, setManualLoading] = useState(false);

  // 加载loading
  const loading = useMemo(() => {
    return !singer && !songs.length;
  }, [singer, songs]);

  // 注册BScroll,使其能上拉刷新
  const { rootRef, scroll, isPullUpload } = usePullLoad(searchMore, loading || manualLoading);

  /**
   * 是否能下拉刷新,刷新重新计算高度
   */
  const pullUpLoading = useMemo(() => {
    const pullLoading = isPullUpload && hasMore;
    if (loading) {
      scroll.current?.refresh();
    }
    return pullLoading;
  }, [isPullUpload, hasMore]);

  /**
   *  监听query变换, 搜索歌曲发送请求
   */
  useEffect(() => {
    /**
     * 第一次获取数据
     */
    async function searchFirst() {
      if (!debouncedQuery) return;
      setSongs([]);
      setSinger(null);
      page.current = 1;
      const result = await search(debouncedQuery, page.current, showSinger);
      const songs = await processSongs(result.songs);
      setSinger(result?.singer || null);
      setSongs(songs);
      setHasMore(result.hasMore);
    }

    searchFirst();
  }, [debouncedQuery]);

  /**
   * 加载更多数据
   */
  async function searchMore() {
    if (!hasMore || !debouncedQuery) return;
    page.current = page.current + 1;
    const result = await search(debouncedQuery, page.current, showSinger);
    const songs = await processSongs(result.songs);
    setHasMore(result.hasMore);
    // 防止没有数据也返回true的bug
    if (result.hasMore && !songs.length) {
      setHasMore(false);
      return;
    }
    setSongs((oldSongs) => oldSongs.concat(songs));
    await nextTick(200);
    // 判断是否能向下滚动
    if (scroll.current.maxScrollY >= -1) {
      setManualLoading(true);
      await searchMore();
      setManualLoading(false);
    }
  }

  // 渲染加载和无数据显示
  if (loading && !hasMore) {
    return <NoResult title={'抱歉，暂无搜索结果'} />;
  } else if (loading) {
    return <Loading />;
  }
  return (
    <div className={styles.suggest} ref={rootRef}>
      <ul className={styles.suggestList}>
        {singer ? (
          <li className={styles.suggestItem} onClick={() => selectItemSinger?.(singer)}>
            <div className={styles.icon}>
              <i className="icon-mine" />
            </div>
            <div className={styles.name}>
              <p className="no-wrap">{singer.name}</p>
            </div>
          </li>
        ) : (
          <></>
        )}
        {songs.map((song, index) => (
          <li className={styles.suggestItem} key={song.id + index + song.name} onClick={() => selectItemSong(song)}>
            <div className={styles.icon}>
              <i className={'icon-music'} />
            </div>
            <div className={styles.name}>
              <p className={'no-wrap'}>
                {song.singer}-{song.name}
              </p>
            </div>
          </li>
        ))}
        <div
          className={styles.suggestItem}
          style={{ display: pullUpLoading ? '' : 'none' }}
          children={<Loading title={''} />}
        />
      </ul>
    </div>
  );
};

export default Suggest;
