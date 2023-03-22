import request from '../utils/request';

import { AlbumParams, ResRecommend } from '../pages/recommend/Recommend';
import { Song } from '../pages/singer/singerDetail/SingerDetail';

export async function getRecommend(): Promise<ResRecommend> {
  try {
    const result: {
      code: number;
      result: ResRecommend;
    } = await request.get('/api/getRecommend');
    return result.result;
  } catch (e) {
    return { albums: [], sliders: [] };
  }
}

export async function getAlbum(album: AlbumParams) {
  try {
    const result: {
      code: number;
      result: {
        songs: Song[];
      };
    } = await request.get('/api/getAlbum', {
      params: {
        id: album.id
      }
    });
    return result.result;
  } catch (e) {
    return { songs: [] };
  }
}
