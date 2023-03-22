import { Song } from '../pages/singer/singerDetail/SingerDetail';
import request from '../utils/request';

export function processSongs(songs: Song[]) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  return request
    .get('./api/getSongsUrl', {
      params: {
        mid: songs.map(({ mid }) => mid)
      }
    })
    .then((res: any) => {
      const map = res.result.map;
      return songs
        .map((song) => {
          song.url = map[`${song.mid}`];
          return song;
        })
        .filter((song) => {
          return song.url && song.url.indexOf('vkey') > -1;
        });
    });
}

const lyricMap: any = {};
export function getLyric(song: Song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric);
  }
  const mid = song.mid;
  if (lyricMap[mid]) {
    return Promise.resolve(lyricMap[mid]);
  }
  return request
    .get('/api/getLyric', {
      params: {
        mid
      }
    })
    .then((res: any) => {
      const lyric = res.result ? res.result.lyric : '[00:00:00]该歌曲暂时无法获取歌词';
      lyricMap[mid] = lyric;
      return lyric;
    });
}
