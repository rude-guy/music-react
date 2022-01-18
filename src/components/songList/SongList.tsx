import React, {useCallback} from 'react'
import styles from './SongList.module.css'
import {Song} from '../../pages/singer/singerDetail/SingerDetail'

interface SongListProps {
    songs: Song[]
    onSelectItem?: (song: Song, index: number) => void
}

const SongList: React.FC<SongListProps> = ({songs, onSelectItem}) => {
    return <div className={styles.songListWrapper}>
        <ul className={styles.songList}>
            {
                songs.map((song, index) => {
                    return <li className={styles.item}
                               key={song.id}
                               onClick={() => onSelectItem?.(song, index)}
                    >
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
