import { useAppDispatch } from '../../store/hooks';
import { save } from '../../assets/ts/arrayStroe';
import { Song } from '../../pages/singer/singerDetail/SingerDetail';
import { PLAY_KEY } from '../../assets/ts/constant';
import { setPlayHistory } from '../../store/reducers';

/**
 * 自定义hooks
 * 存储播放历史
 */
const usePlayHistory = () => {
  const dispatch = useAppDispatch();

  // 存储播放历史
  function savePlayHistory(song: Song) {
    const songs = save(song, PLAY_KEY, (item) => item.id === song.id);
    dispatch(setPlayHistory(songs));
  }

  return { savePlayHistory };
};

export default usePlayHistory;
