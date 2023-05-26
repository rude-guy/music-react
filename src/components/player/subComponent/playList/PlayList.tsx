import React, { useRef, useState } from 'react';
import styles from './PlayList.module.css';
import ReactDOM from 'react-dom';
import Scroll from '../../../scroll/Scroll';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { getCurrentSong, selectMusic, setCurrentIndex, setPlayingState } from '../../../../store/reducers';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import usePlayMode from '../../usePlayMode';
import { stopPropagation } from '../../../../utils/public';
import useFavorite from '../../useFavorite';
import { Song } from '../../../../pages/singer/singerDetail/SingerDetail';
import { clearSongList, removeSong } from '../../../../store/actions';
import Confirm from '../confirm/Confirm';
import useConfirm from '../confirm/useConfirm';
import { useVisible } from './useVisible';
import AddSong from '../addSong/AddSong';

const PlayList = () => {
  const {  playList } = useAppSelector(selectMusic);
  const currentSong = useAppSelector(getCurrentSong);
  const dispatch = useAppDispatch();

  // 组件的显示隐藏 动画效果
  const { closeVisible, visible, playListRef, refreshScroll, scrollToElement } = useVisible();

  // 播放模式切换
  const { modeText, modeIcon, togglePlayMode } = usePlayMode();

  // 收藏切换
  const { getFavoriteIcon, toggleFavorite } = useFavorite();

  // AddSong组件转发Ref
  const addSongRef = useRef<any>(null);

  const timer = useRef<NodeJS.Timeout | null>(null);
  /**
   * 切换歌曲
   * @param song
   * @param e
   */
  const changeSong = (song: Song, e: React.MouseEvent) => {
    const index = playList.findIndex((item) => song.id === item.id);
    dispatch(setCurrentIndex(index));
    dispatch(setPlayingState(true));
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      scrollToElement(e.target as HTMLElement);
    }, 800);
  };

  const [removing, setRemoving] = useState(false);
  /**
   * 删除歌曲
   * @param song
   * @param e
   */
  const deleteSong = (song: Song, e: React.MouseEvent) => {
    stopPropagation(e);
    if (removing) return;
    setRemoving(true);
    refreshScroll(); // 重新计算高度
    dispatch(removeSong(song));
    if (!playList.length) {
      closeVisible();
    }
    setTimeout(() => {
      setRemoving(false);
    }, 300);
  };

  /**
   * 跳转到添加歌曲
   */
  const onAddSong = () => {
    addSongRef.current?.showVisible();
  };

  // 显示Confirm对话框
  const { confirmRef, openConfirm } = useConfirm();
  /**
   * 清空列表
   */
  function onConfirmClear() {
    dispatch(clearSongList());
    closeVisible();
  }

  return (
    <CSSTransition classNames={'list-fade'} timeout={300} in={visible}>
      <div className={styles.playlist} onClick={closeVisible}>
        <div className={`${styles.listWrapper} list-wrapper`} onClick={stopPropagation}>
          <div className={styles.listHeader}>
            <h1 className={styles.title}>
              <i className={`${styles.icon} ${modeIcon}`} onClickCapture={togglePlayMode} />
              <span className={`${styles.text}  no-wrap`}>{modeText}</span>
              <span className={'extend-click'} onClick={openConfirm}>
                <i className={`icon-clear ${styles.iconClear}`} />
              </span>
            </h1>
          </div>
          <Scroll ref={playListRef} className={styles.listContent}>
            <ul>
              <TransitionGroup component={null}>
                {playList.map((song) => (
                  <CSSTransition key={song.id} classNames={'list'} timeout={300}>
                    <li className={styles.item} onClick={(e) => changeSong(song, e)}>
                      <i className={`${styles.current} ${currentSong.id === song.id ? 'icon-play' : ''}`} />
                      <span className={`${styles.text} no-wrap`}>{song.name}</span>
                      <span className={`${styles.favorite} extend-click`} onClick={() => toggleFavorite(song)}>
                        {' '}
                        <i className={getFavoriteIcon(song)} />
                      </span>
                      <span
                        className={`${styles.delete} extend-click ${removing ? styles.delete : ''}`}
                        onClick={(e) => deleteSong(song, e)}
                      >
                        {' '}
                        <i className={'icon-delete'} />
                      </span>
                    </li>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </ul>
          </Scroll>
          <div className={styles.listAdd}>
            <div className={styles.add} onClick={onAddSong}>
              <i className={`icon-add ${styles.iconAdd}`} />
              <span className={styles.text}>添加歌曲到队列</span>
            </div>
          </div>
          <div className={styles.listFooter} onClick={closeVisible}>
            <span>关闭</span>
          </div>
        </div>
        <Confirm ref={confirmRef} text={'是否清空播放列表？'} confirmBtnText={'清空'} confirm={onConfirmClear} />
        <AddSong ref={addSongRef} />
      </div>
    </CSSTransition>
  );
};

/**
 * 把DOM portal到body上
 */
export default () => {
  return ReactDOM.createPortal(<PlayList />, document.getElementsByTagName('body')[0]);
};
