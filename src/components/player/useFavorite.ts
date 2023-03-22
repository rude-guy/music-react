import { useAppSelector } from '../../store/hooks';
import { selectMusic, setFavoriteList } from '../../store/reducers';
import { useDispatch } from 'react-redux';
import { Song } from '../../pages/singer/singerDetail/SingerDetail';
import { useMemo } from 'react';
import { remove, save } from '../../assets/ts/arrayStroe';
import { FAVORITE_KEY } from '../../assets/ts/constant';

/**
 * 自定义hooks
 * favorite相关样式
 */
const useFavorite = () => {
  const { favoriteList } = useAppSelector(selectMusic);
  const dispatch = useDispatch();

  /**
   * 喜欢和不喜欢切换，并派发对应的事件
   * @param song
   */
  function toggleFavorite(song: Song) {
    const list = isFavorite(song)
      ? remove(FAVORITE_KEY, (item: Song) => item.id === song.id)
      : save(song, FAVORITE_KEY, (item: Song) => item.id === song.id);
    dispatch(setFavoriteList(list));
  }

  /**
   * 计算当前歌曲对应的 favorite icon
   */
  const isFavorite = useMemo(
    () => (song: Song) => {
      return ~favoriteList.findIndex((item) => item.id === song.id);
    },
    [favoriteList]
  );

  /**
   * 计算当前歌曲对应的 favorite icon
   */
  const getFavoriteIcon = useMemo(
    () => (song: Song) => {
      return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
    },
    [isFavorite]
  );

  return {
    toggleFavorite,
    getFavoriteIcon
  };
};

export default useFavorite;
