import request from '../utils/request'
import {SingerData} from '../pages/singer/Singer'

export async function getSingerList () {
    try {
        const result: {
            code: number
            result: {
                singers: SingerData[]
            }
        } = await request.get('/api/getSingerList')
        return result.result.singers
    } catch (e) {
        return [{title: '', list: []}] as SingerData[]
    }
}
