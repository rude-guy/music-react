import request from '../utils/request'
import {TopListParams} from '../pages/topList/TopList'
import {Song} from '../pages/singer/singerDetail/SingerDetail'

export async function getTopList () {
    try {
        const result: {
            code: number
            result: {
                topList: TopListParams[]
            }
        } = await request.get('./api/getTopList')

        return result.result
    } catch (e) {
        return {topList: []}
    }
}

export async function getTopDetail (top: TopListParams) {
    try {
        const result: {
            code: number
            result: {
                songs: Song[]
            }
        } = await request.get('/api/getTopDetail', {
            params: {
                id: top.id,
                period: top.period
            }
        })
        return result.result
    } catch (e) {
        return {songs: []}
    }
}
