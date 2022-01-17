import React from 'react'
import styles from './SongList.module.css'
import {Song} from '../../pages/singer/singerDetail/SingerDetail'

interface SongListProps {
    songs: Song[]
}

const SongList: React.FC<SongListProps> = ({songs}) => {
    return <div className={styles.songListWrapper}>
        <ul className={styles.songList}>
            {
                songs.map(song => {
                    return <li className={styles.item} key={song.id}>
                        {/*<div className={styles.rank}>*/}
                        {/*    <span className={styles.icon} />*/}
                        {/*</div>*/}
                        <div className={styles.content}>
                            <h2 className={`no-wrap ${styles.name}`}>{song.name}</h2>
                            <p className={`no-wrap ${styles.desc}`}>{`${song.singer}·${song.album}`}</p>
                        </div>
                    </li>
                })
            }
        </ul>
    </div>
}

export default SongList
