import React, {useEffect, useState} from 'react'
import styles from './SingerDetail.module.css'
import MusicList from '../../../components/musicList/MusicList'
import {getSingerDetail} from '../../../services/singer'
import {SingerInfo} from '../Singer'
import storage from 'good-storage'
import {SINGER_KEY} from '../../../assets/ts/constant'

export interface Song {
    album: string
    duration: number
    id: number
    mid: string
    name: string
    pic: string
    singer: string
    url: string
    [params: string]: any
}

export type Rest = {
    pic?: String
    title?: String
}

export const SingerDetail = () => {
    const [songs, setSongs] = useState<Song[]>([])
    const [rest, setRest] = useState<Rest>({})
    useEffect(() => {
        const singer: SingerInfo = storage.session.get(SINGER_KEY)
        setRest({
            pic: singer.pic,
            title: singer.name
        })
        getSingerDetail(singer).then(result => {
            console.log(result)
            setSongs(result)
        })
    }, [setSongs])

    return <div className={styles.topDetail}>
        <MusicList songs={songs} {...rest}/>
    </div>
}
