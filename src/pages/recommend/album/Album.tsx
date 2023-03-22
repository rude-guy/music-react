import React, { useLayoutEffect, useState } from 'react';
import styles from './Album.module.css';
import MusicList from '../../../components/musicList/MusicList';
import { useHistory, useParams } from 'react-router-dom';
import storage from 'good-storage';
import { ALBUM_KEY } from '../../../assets/ts/constant';
import { Rest, Song } from '../../singer/singerDetail/SingerDetail';
import { AlbumParams } from '../Recommend';
import { getAlbum } from '../../../services/recommend';
import { useSongs } from '../../../utils/hooks';

const Album = () => {
  const [rest, setRest] = useState<Rest>({
    pic: '',
    title: ''
  });
  const { albumId } = useParams<{ albumId: string }>();
  const history = useHistory();

  // 获取详情页数据
  const { songs, noResult, getSongs } = useSongs<Song, AlbumParams>(getAlbum);

  /**
   * 初始化数据
   */
  useLayoutEffect(() => {
    const album: AlbumParams = storage.session.get(ALBUM_KEY);
    if (album.id !== +albumId) {
      history.goBack();
      return;
    }
    setRest({
      pic: album.pic || '',
      title: album.title || ''
    });
    getSongs(album);
  }, []);

  return (
    <div className={styles.album}>
      <MusicList songs={songs} noResult={noResult} {...rest} />
    </div>
  );
};

export default Album;
