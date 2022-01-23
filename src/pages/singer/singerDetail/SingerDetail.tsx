import React, {useLayoutEffect, useState} from 'react'
import styles from './SingerDetail.module.css'
import MusicList from '../../../components/musicList/MusicList'
import {getSingerDetail} from '../../../services/singer'
import {SingerInfo} from '../Singer'
import storage from 'good-storage'
import {SINGER_KEY} from '../../../assets/ts/constant'
import {processSongs} from '../../../services/song'
import {useHistory, useParams} from 'react-router-dom'

/*
 * 歌曲数据结构
 */
export interface Song {
    album: string
    duration: number
    id: number
    mid: string
    name: string
    pic: string
    singer: string
    url: string
    lyric?: string
}

/*
 *  musicList剩余参数注解
 *  {pic: 图像, title: 标题}
 */
export type Rest = {
    pic: string
    title: string
}

/**
 * 组件Props
 */
interface Props {
    singerInfo?: SingerInfo
}

export const SingerDetail: React.FC<Props> = ({singerInfo}) => {
    const [songs, setSongs] = useState<Song[]>([])
    const [rest, setRest] = useState<Rest>({
        pic: '',
        title: ''
    })
    const {singerId} = useParams<{ singerId: string }>()
    const history = useHistory()
    const [noResult, setNoResult] = useState(false)

    /**
     * 初始化歌手详情页数据
     */
    useLayoutEffect(() => {
        let singer: SingerInfo = singerInfo ? singerInfo : storage.session.get(SINGER_KEY)
        setRest({
            pic: singer.pic || '',
            title: singer.name || ''
        })
        if (singer.mid !== singerId) {
            history.goBack()
            return
        }
        /**
         * 获取歌曲列表并添加播放链接
         */
        getSingerDetail(singer).then(songs => {
            return processSongs(songs)
        }).then(songs => {
            setSongs(songs)
        }).catch(() => {
            setNoResult(true)
        })
    }, [])

    return <div className={styles.topDetail}>
        <MusicList songs={songs} noResult={noResult} {...rest}/>
    </div>
}
