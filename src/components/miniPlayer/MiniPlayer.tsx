import React, {useCallback} from 'react'
import styles from './MiniPlayer.module.css'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {getCurrentSong, selectMusic, setFullScreen} from '../../store/reducers'
import ProgressCircle from '../progressCircle/ProgressCircle'
import {useTogglePlaying} from '../player/useAudio'

const MiniPlayer = () => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector(getCurrentSong)
    const {playing} = useAppSelector(selectMusic)

    // 切换播放状态
    const togglePlaying = useTogglePlaying()

    const toggleFullScreen = useCallback(() => {
        dispatch(setFullScreen(true))
    }, [dispatch])

    return (
        <div className={styles.miniPlayer}
             onClick={toggleFullScreen}
        >
            <div className={styles.cdWrapper}>
                <div className={styles.cd}>
                    <img width={'40'} height={'40'}
                         className={`${styles.playing} ${playing ? styles.running : styles.paused}`}
                         src={currentSong.pic} alt={'mini'}
                    />
                </div>
            </div>
            <div className={styles.sliderWrapper}>
                <div className={styles.sliderGroup}>
                    <div
                        className={styles.sliderPage}>
                        <h2 className={`${styles.name} no-wrap`}>{currentSong.name}</h2>
                        <p className={`${styles.desc} no-wrap`}>{currentSong.singer}</p>
                    </div>
                </div>
            </div>
            <div className={styles.control}>
                <ProgressCircle radius={32}>
                    <i className={`${styles.iconMini} ${playing ? 'icon-pause-mini' : 'icon-play-mini'}`}
                       onClickCapture={togglePlaying}
                    />
                </ProgressCircle>
            </div>
            <div className={styles.control}>
                <i className={`${styles.iconPlaylist} icon-playlist`}/>
            </div>
            {/*<div>playList</div>*/}
        </div>
    )
}

export default MiniPlayer
