import request from '../utils/request'

import {ResRecommend} from '../pages/recommend/Recommend'

export async function getRecommend (): Promise<ResRecommend> {
    try {
        const result: {
            code: number
            result: ResRecommend
        } = await request.get('/api/getRecommend')
        return result.result
    } catch (e) {
        return {albums: [], sliders: []}
    }
}
