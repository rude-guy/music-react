import request from '../utils/request'
import {SingerData, SingerInfo} from '../pages/singer/Singer'
import {Song} from '../pages/singer/singerDetail/SingerDetail'

export async function getSingerList (): Promise<SingerData[]> {
    try {
        const result: {
            code: number
            result: {
                singers: SingerData[]
            }
        } = await request.get('/api/getSingerList')
        return result.result.singers
    } catch (e) {
        return [{title: '', list: []}]
    }
}
export async function getSingerDetail (singer: SingerInfo): Promise<Song[]> {
    try {
        const result: {
            code: number
            result: {
                songs: Song[]
            }
        } = await request.get('/api/getSingerDetail', {
            params: {
                mid: singer.mid
            }
        })
        return result.result.songs
    } catch (e) {
        return []
    }
}
