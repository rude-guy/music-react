// 播放状态
import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getCurrentSong, PLAY_MODE, selectMusic, setCurrentIndex, setPlayingState } from '../../store/reducers';
import usePlayHistory from './usePlayHistory';

export type AudioRef = {
  audioRef: React.RefObject<HTMLAudioElement>;
};

type AudioState = {
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setSongReady: React.Dispatch<React.SetStateAction<boolean>>;
  playLyric: () => void;
  stopLyric: () => void;
} & AudioRef;

type Audio = {
  songReady: boolean;
  progressChanging: boolean;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setSongReady: React.Dispatch<React.SetStateAction<boolean>>;
} & AudioRef;

/**
 * 自定义hooks
 * 播放状态相关
 * @param audioRef: audio Dom元素的Ref
 * @param setCurrentTime
 * @param setSongReady
 * @param playLyric: 跳转歌词
 * @param stopLyric: 停止跳转歌词
 */
export const useAudioState = ({ audioRef, setCurrentTime, setSongReady, playLyric, stopLyric }: AudioState) => {
  const currentSong = useAppSelector(getCurrentSong);
  const { playing } = useAppSelector(selectMusic);
  const dispatch = useAppDispatch();

  /**
   * 窃听当前歌曲变化
   */
  useEffect(() => {
    const audioVal = audioRef.current;
    if (!currentSong.id || !currentSong.url || audioVal == null) {
      // 防止播放器二次调用play()导致错误
      audioVal?.pause();
      audioVal?.load();
      return;
    }
    /**
     * 防止切换模式时，currentSong变化导致进度条跳动
     */
    if (audioVal.src !== currentSong.url) {
      setSongReady(false);
      setCurrentTime(0);
      audioVal.src = currentSong.url;
      audioVal.play();
      dispatch(setPlayingState(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentSong]);

  /**
   * 窃听当前播放状态
   */
  useEffect(() => {
    const audioVal = audioRef.current;
    if (audioVal == null) return;
    if (playing) {
      audioVal.play();
      playLyric();
    } else {
      audioVal.pause();
      stopLyric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  return { audioRef, currentSong };
};

/**
 * 自定义hooks
 * 播放暂停切换
 */
export const useTogglePlaying = () => {
  const dispatch = useAppDispatch();
  const { playing } = useAppSelector(selectMusic);
  // 播放暂停切换
  return useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(setPlayingState(!playing));
    },
    [dispatch, playing]
  );
};

/**
 * 自定义hooks
 * 播放器切换歌曲相关
 * @param songReady
 * @param setSongReady
 * @param setCurrentTime
 * @param audioRef:  audio Dom元素的Ref
 * @param progressChanging: 移动进度条 move
 */
const useAudio = ({ songReady, setSongReady, setCurrentTime, audioRef, progressChanging }: Audio) => {
  const { playMode, currentIndex, playList } = useAppSelector(selectMusic);
  const dispatch = useAppDispatch();
  const currentSong = useAppSelector(getCurrentSong);

  // 存储播放历史
  const { savePlayHistory } = usePlayHistory();

  /**
   * 循环播放
   */
  function loop() {
    const audioVal = audioRef.current;
    if (audioVal === null) return;
    audioVal.currentTime = 0;
    audioVal.play();
    dispatch(setPlayingState(true));
  }

  /**
   * 上一首
   */
  function prevSong() {
    const playLen = playList.length;
    if (!playLen || !songReady) return;
    if (playLen === 1) {
      loop();
      return;
    }
    const index = currentIndex === 0 ? playLen - 1 : currentIndex - 1;
    dispatch(setCurrentIndex(index));
  }

  /**
   * 下一首
   */
  function nextSong() {
    const playLen = playList.length;
    if (!playLen || !songReady) return;
    if (playLen === 1) {
      loop();
      return;
    }
    const index = playLen - 1 === currentIndex ? 0 : currentIndex + 1;
    dispatch(setCurrentIndex(index));
  }

  /**
   * 更新播放时间
   */
  function ontimeupdate(e: any) {
    if (progressChanging) return;
    setCurrentTime(e.target.currentTime);
  }

  /**
   *  窃听audio标签暂停事件
   */
  const onpause = useCallback(() => {
    dispatch(setPlayingState(false));
  }, [dispatch]);

  /**
   * 监听audio音频是否准备完成
   */
  function oncanplay() {
    if (songReady) return;
    setSongReady(true);
    savePlayHistory(currentSong);
  }

  /**
   * 监听audio音频播放结束
   */
  function onended() {
    playMode === PLAY_MODE.loop ? loop() : nextSong();
  }

  /**
   * 监听audio音频播放错误
   */
  function onerror() {
    setSongReady(true);
  }

  return {
    ontimeupdate,
    onpause,
    oncanplay,
    onended,
    onerror,
    prevSong,
    nextSong
  };
};

export default useAudio;
