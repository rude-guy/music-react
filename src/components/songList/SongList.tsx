import React, {HTMLAttributes, useMemo} from 'react'
import styles from './SongList.module.css'
import {Song} from '../../pages/singer/singerDetail/SingerDetail'

interface SongListProps extends HTMLAttributes<HTMLDivElement> {
    songs: Song[]
    rank?: boolean
    onSelectItem?: (song: Song, index: number) => void
}

const SongList: React.FC<SongListProps> = React.memo(({songs, onSelectItem, rank, ...props}) => {
    const rankRender = useMemo(() => (index: number) => {
        return rank ? <div className={styles.rank}>
            <span className={index <= 2 ? `${styles.icon} ${styles['icon' + index]}` : styles.text}>
                {index > 2 ? index : ''}
            </span>
        </div> : <></>
    }, [rank])

    return <div className={styles.songListWrapper} {...props}>
        <ul className={styles.songList}>
            {
                songs.map((song, index) => {
                    return <li className={styles.item}
                               key={song.id}
                               onClick={() => onSelectItem?.(song, index)}
                    >
                        {rankRender(index)}
                        <div className={styles.content}>
                            <h2 className={`no-wrap ${styles.name}`}>{song.name}</h2>
                            <p className={`no-wrap ${styles.desc}`}>{`${song.singer}·${song.album}`}</p>
                        </div>
                    </li>
                })
            }
        </ul>
    </div>
})

SongList.defaultProps = {
    songs: [],
    rank: false
}

export default SongList
