import { Song } from '../../pages/singer/singerDetail/SingerDetail';
import { useAppDispatch } from '../../store/hooks';
import { randomPlay, selectPlay } from '../../store/actions';

/**
 * 自定义hooks
 * 派发事件 dispatch
 * @param songs
 */
export const useStore = ({ songs }: { songs: Song[] }) => {
  const dispatch = useAppDispatch();

  /**
   * 派发选择的歌曲
   * @param song: 歌曲
   * @param index: 对应的序号
   */
  function onSelectItem(song: Song, index: number) {
    dispatch(selectPlay({ list: songs, index }));
  }

  /**
   * 派发随机播放
   */
  function onRandomPlaying() {
    dispatch(randomPlay(songs));
  }

  return {
    onSelectItem,
    onRandomPlaying
  };
};
