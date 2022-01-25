import React, {useLayoutEffect, useState} from 'react'
import styles from './TopDetail.module.css'
import MusicList from '../../../components/musicList/MusicList'
import {Rest, Song} from '../../singer/singerDetail/SingerDetail'
import {useHistory, useParams} from 'react-router-dom'
import storage from 'good-storage'
import {TOP_KEY} from '../../../assets/ts/constant'
import {getTopDetail} from '../../../services/topList'
import {TopListParams} from '../TopList'
import {useSongs} from '../../../utils/hooks'

const TopDetail = () => {
    const [rest, setRest] = useState<Rest>({
        pic: '',
        title: ''
    })
    const {topListId} = useParams<{ topListId: string }>()
    const history = useHistory()

    // 获取详情页数据
    const {songs, noResult, getSongs} = useSongs<Song, TopListParams>(getTopDetail)

    /**
     * 初始化歌手数据，无数据返回
     */
    useLayoutEffect(() => {
        const top: TopListParams = storage.session.get(TOP_KEY)
        setRest({
            pic: top.pic || '',
            title: top.name || ''
        })
        if (top.id !== +topListId) {
            history.goBack()
            return
        }
        getSongs(top)
    }, [])

    return <div className={styles.topDetail}>
        <MusicList songs={songs} noResult={noResult} {...rest} rank/>
    </div>
}
export default TopDetail
