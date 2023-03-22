import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getCurrentSong, selectMusic, setPlayingState } from '../../store/reducers';
import React, { useMemo, useState } from 'react';
import { AudioRef } from './useAudio';

type UseProgress = {
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  playLyric: (currentTime?: number) => void;
  stopLyric: () => void;
} & AudioRef;

/**
 * 自定义hooks
 * 进度条相关
 * @param currentTime
 * @param setCurrentTime
 * @param audioRef: audio Dom元素的Ref
 * @param playLyric: 跳转歌词
 * @param stopLyric: 停止跳转歌词
 */
const useProgress = ({ currentTime, setCurrentTime, audioRef, playLyric, stopLyric }: UseProgress) => {
  const currentSong = useAppSelector(getCurrentSong);
  const { playing } = useAppSelector(selectMusic);
  const dispatch = useAppDispatch();
  const [progressChanging, setProgressChanging] = useState(false);

  /**
   * 计算歌曲进度比例
   */
  const progress = useMemo(() => {
    return currentTime / currentSong.duration;
  }, [currentTime, currentSong]);

  /**
   * 移动进度条 move
   * @param progress
   */
  function onProgressChanging(progress: number) {
    setProgressChanging(true);
    setCurrentTime(progress * currentSong.duration);
    playLyric();
    stopLyric();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  /**
   * 移动进度条结束 end
   * @param progress
   */
  function onProgressChanged(progress: number) {
    setProgressChanging(false);
    const currentTime = progress * currentSong.duration;
    setCurrentTime(() => currentTime);
    // debugger
    playLyric(currentTime);
    if (!playing) dispatch(setPlayingState(true));
    if (audioRef.current == null) return;
    audioRef.current.currentTime = currentTime;
  }

  return {
    progressChanging,
    progress,
    onProgressChanging,
    onProgressChanged
  };
};

export default useProgress;
