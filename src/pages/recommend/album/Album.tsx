import React, {useLayoutEffect, useState} from 'react'
import styles from './Album.module.css'
import MusicList from '../../../components/musicList/MusicList'
import {useHistory, useParams} from 'react-router-dom'
import storage from 'good-storage'
import {ALBUM_KEY} from '../../../assets/ts/constant'
import {Rest, Song} from '../../singer/singerDetail/SingerDetail'
import {AlbumParams} from '../Recommend'
import {getAlbum} from '../../../services/recommend'

const Album = () => {
    const [songs, setSongs] = useState<Song[]>([])
    const [rest, setRest] = useState<Rest>({
        pic: '',
        title: ''
    })
    const {albumId} = useParams<{ albumId: string }>()
    const history = useHistory()
    const [noResult, setNoResult] = useState(false)

    useLayoutEffect(() => {
        const album: AlbumParams = storage.session.get(ALBUM_KEY)
        setRest({
            pic: album.pic || '',
            title: album.title || ''
        })
        if (album.id !== +albumId) {
            history.goBack()
            return
        }
        getAlbum(album).then(result => {
            if (result.songs.length) {
                setSongs(result.songs)
                return
            }
            setNoResult(true)
        })
    }, [])

    return <div className={styles.album}>
        <MusicList songs={songs} noResult={noResult} {...rest}/>
    </div>
}

export default Album
