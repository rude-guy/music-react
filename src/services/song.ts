import {Song} from '../pages/singer/singerDetail/SingerDetail'
import request from '../utils/request'

export function processSongs (songs: Song[]) {
    if (!songs.length) {
        return Promise.resolve(songs)
    }
    return request.get('./api/getSongsUrl', {
        params: {
            mid: songs.map(({mid}) => mid)
        }
    }).then((res: any) => {
        console.log(res)
        const map = res.map
        return songs.map(song => {
            song.url = map[song.mid]
            return song
        }).filter(song => {
            return song.url && song.url.indexOf('vkey') > -1
        })
    })
}
