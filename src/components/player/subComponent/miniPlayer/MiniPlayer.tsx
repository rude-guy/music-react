import React, {createContext, useState} from 'react'
import styles from './MiniPlayer.module.css'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {getCurrentSong, selectMusic, setFullScreen} from '../../../../store/reducers'
import ProgressCircle from '../progressCircle/ProgressCircle'
import {useTogglePlaying} from '../../useAudio'
import PlayList from '../playList/PlayList'

interface MiniContextParams {
    open: boolean

    closePlayList (): void
}

export const MiniContext = createContext<MiniContextParams>({
    open: false,
    closePlayList: () => {
    }
})

const MiniPlayer = () => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector(getCurrentSong)
    const {playing} = useAppSelector(selectMusic)

    // 切换播放状态
    const togglePlaying = useTogglePlaying()

    /**
     * 屏幕打开关闭切换
     */
    const toggleFullScreen = () => {
        dispatch(setFullScreen(true))
    }

    const [open, setOpen] = useState(false)

    /**
     * 打开mini播放器
     * @param e
     */
    function openPlayList (e: React.MouseEvent) {
        setOpen(true)
        e.stopPropagation()
    }

    /**
     * 关闭mini播放器
     */
    function closePlayList () {
        setOpen(false)
    }

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
            <div className={styles.control} onClick={openPlayList}>
                <i className={`${styles.iconPlaylist} icon-playlist`}/>
            </div>
            <MiniContext.Provider value={{
                open,
                closePlayList
            }}>
                <PlayList/>
            </MiniContext.Provider>
        </div>
    )
}

export default MiniPlayer
