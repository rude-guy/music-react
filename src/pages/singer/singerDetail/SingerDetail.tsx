import React, {useLayoutEffect, useState} from 'react'
import styles from './SingerDetail.module.css'
import MusicList from '../../../components/musicList/MusicList'
import {getSingerDetail} from '../../../services/singer'
import {SingerInfo} from '../Singer'
import storage from 'good-storage'
import {SINGER_KEY} from '../../../assets/ts/constant'
import {processSongs} from '../../../services/song'
import {useHistory, useParams} from 'react-router-dom'
import {CSSTransition} from 'react-transition-group'

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

export type Rest = {
    pic: string
    title: string
}


export const SingerDetail = () => {
    const [songs, setSongs] = useState<Song[]>([])
    const [rest, setRest] = useState<Rest>({
        pic: '',
        title: ''
    })
    const {singerId} = useParams<{ singerId: string }>()
    const history = useHistory()
    const [noResult, setNoResult] = useState(false)

    const [show, setShow] = useState(true)

    function goBack () {
        setShow(false)
    }

    useLayoutEffect(() => {
        const singer: SingerInfo = storage.session.get(SINGER_KEY)
        setRest({
            pic: singer.pic || '',
            title: singer.name || ''
        })
        if (singer.mid !== singerId) {
            history.goBack()
            return
        }
        getSingerDetail(singer).then(songs => {
            return processSongs(songs)
        }).then(songs => {
            setSongs(songs)
        }).catch(() => {
            setNoResult(true)
        })
    }, [])

    return <CSSTransition classNames={'slide'} timeout={300} in={show} appear={true} unmountOnExit onExited={history.goBack}>
        <div className={styles.topDetail}>
            <MusicList songs={songs} goBack={goBack} noResult={noResult} {...rest}/>
        </div>
    </CSSTransition>
}
