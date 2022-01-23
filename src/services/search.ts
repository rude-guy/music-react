import request from '../utils/request'
import {HotKey} from '../pages/search/Search'
import {Song} from '../pages/singer/singerDetail/SingerDetail'
import {SingerInfo} from '../pages/singer/Singer'

// 获取热门关键字
export async function getHotKeys () {
    try {
        const result: {
            code: number
            result: {
                hotKeys: HotKey[]
            }
        } = await request.get('/api/getHotKeys')
        return result.result
    } catch (e) {
        return {hotKeys: []}
    }
}

// 搜索歌词
export async function search (query: string, page: number, showSinger: boolean) {
    try {
        const result: {
            code: number
            result: {
                hasMore: boolean
                singer?: SingerInfo
                songs: Song[]
            }
        } = await request.get('/api/search', {
            params: {
                query, page, showSinger
            }
        })
        return result.result
    } catch (e) {
        return {hasMore: false, songs: []}
    }
}
