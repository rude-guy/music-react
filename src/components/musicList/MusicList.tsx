import React, {useEffect, useRef} from 'react'
import styles from './MusicList.module.css'
import {Rest, Song} from '../../pages/singer/singerDetail/SingerDetail'
import {useHistory} from 'react-router-dom'

type Props = {
    songs: Song[]
} & Rest

const MusicList: React.FC<Props> = (props) => {
    const {songs, pic, title} = props
    const history = useHistory()
    return (
        <div className={styles.musicList}
        >
            <div className={styles.back} onClick={() => history.goBack()}>
                <i className={`icon-back ${styles.iconBack}`}/>
            </div>
            <h1 className={`${styles.title} no-wrap`}>{title}</h1>
            <div className={styles.bgImage} style={{backgroundImage: `url(${pic})`, height: '.4rem', paddingTop: '70%'}}>
                <div className={styles.playBtnWrapper}>
                    <div className={styles.playBtn}>
                        <i className={`icon-play ${styles.iconPlay}`}/>
                        <span className={styles.text}>随机播放全部</span>
                    </div>
                </div>
                <div className={styles.filter}/>
            </div>
            <div className={styles.list}>
                <div className={styles.songListWrapper}>
                    <ul className={styles.songList}>
                        {
                            songs.map(song => {
                                return <li className={styles.item} key={song.id}>
                                    {/*<div className={styles.rank}>*/}
                                    {/*    <span className={styles.icon} />*/}
                                    {/*</div>*/}
                                    <div className={styles.content}>
                                        <h2 className={`no-wrap ${styles.name}`}>{song.name}</h2>
                                        <p className={`no-wrap ${styles.desc}`}>{song.album}</p>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MusicList
