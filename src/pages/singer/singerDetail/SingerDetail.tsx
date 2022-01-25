import React, {useLayoutEffect, useState} from 'react'
import styles from './SingerDetail.module.css'
import MusicList from '../../../components/musicList/MusicList'
import {SingerInfo} from '../Singer'
import storage from 'good-storage'
import {SINGER_KEY} from '../../../assets/ts/constant'
import {useHistory, useParams} from 'react-router-dom'
import {useSongs} from '../../../utils/hooks'
import {getSingerDetail} from '../../../services/singer'

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
    const [rest, setRest] = useState<Rest>({
        pic: '',
        title: ''
    })
    const {singerId} = useParams<{ singerId: string }>()
    const history = useHistory()

    // 获取详情页数据
    const {songs, noResult, getSongs} = useSongs<Song, SingerInfo>(getSingerDetail)

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
        getSongs(singer)
    }, [])

    return <div className={styles.topDetail}>
        <MusicList songs={songs} noResult={noResult} {...rest}/>
    </div>
}
