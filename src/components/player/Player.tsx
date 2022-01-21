import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import styles from './Player.module.css'
import {CSSTransition} from 'react-transition-group'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {PLAY_MODE, selectMusic, setFullScreen} from '../../store/reducers'
import Scroll from '../scroll/Scroll'
import {changeMode} from '../../store/actions'
import ProgressBar from './subComponent/progressBar/ProgressBar'
import {formatTime} from '../../utils/util'
import useAudio, {useAudioState, useTogglePlaying} from './useAudio'
import useProgress from './useProgress'
import MiniPlayer from './subComponent/miniPlayer/MiniPlayer'
import useLyric from './useLyric'
import useMiddleInteractive from './useMiddleInteractive'
import useAnimation from './useAnimation'

// 熟悉context
export const ProcessContext = React.createContext<number>(0)
ProcessContext.displayName = 'myProcessContext'

// 使用CSSTransition
export const useCssTransition = () => {
    const dispatch = useAppDispatch()
    const {fullScreen} = useAppSelector(selectMusic)
    const [animation, setAnimation] = useState(false)

    function closeFullScreen () {
        dispatch(setFullScreen(false))
    }

    function closeAnimation () {
        setAnimation(false)
    }

    useEffect(() => {
        setAnimation(fullScreen)
        return () => {
            setAnimation(false)
        }
    }, [fullScreen])
    return {
        fullScreen, animation,
        closeFullScreen, closeAnimation
    }
}

const useStore = () => {
    const {
        playList, playing,
    } = useAppSelector(selectMusic)

    const getFavoriteIcon = useMemo(() => {
        return 'icon-not-favorite'
    }, [])

    return {
        playList, playing,
        getFavoriteIcon,
    }
}

// 播放模式
const usePlayMode = () => {
    const {playMode} = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()
    // 播放模式下的icon样式
    const modeIcon = useMemo(() => {
        return playMode === PLAY_MODE.sequence
            ? 'icon-sequence' : playMode === PLAY_MODE.random
                ? 'icon-random' : 'icon-loop'
    }, [playMode])

    // 切换播放模式
    const togglePlayMode = useCallback(() => {
        const mode = (playMode + 1) % 3
        dispatch(changeMode(mode))
    }, [dispatch, playMode])

    return {
        modeIcon, togglePlayMode
    }
}

const Player = () => {
    const {
        playList, playing,
        getFavoriteIcon,
    } = useStore()

    // 播放模式相关
    const {togglePlayMode, modeIcon} = usePlayMode()

    const audioRef = useRef<HTMLAudioElement>(null)

    const [songReady, setSongReady] = useState(false)

    const [currentTime, setCurrentTime] = useState(0)

    // 歌词相关
    const {
        currentLyric, currentLineNum, playLyric, lyricScrollRef,
        lyricListRef, stopLyric, pureMusicLyric, playingLyric
    } = useLyric({currentTime, songReady})

    // 进度条相关逻辑
    const {
        progressChanging, progress,
        onProgressChanging, onProgressChanged
    } = useProgress({currentTime, setCurrentTime, audioRef, playLyric, stopLyric})

    // audio相关
    const {
        ontimeupdate, onpause, oncanplay,
        onended, onerror, prevSong, nextSong,
    } = useAudio({songReady, setSongReady, setCurrentTime, progressChanging, audioRef})

    const togglePlaying = useTogglePlaying()

    // 播放状态
    const {currentSong} = useAudioState({audioRef, setCurrentTime, setSongReady, playLyric, stopLyric})

    // 播放页左右滑动
    const {
        onMiddleTouchstart, onMiddleTouchmove, onMiddleTouchend,
        currentShow, middleRStyle, middleLStyle
    } = useMiddleInteractive()

    // 屏幕动画相关
    const {animation, closeFullScreen, closeAnimation} = useCssTransition()

    const {onEnter, onEntered, onExit, animationStyle} = useAnimation()

    return (
        <div className={'player'}
             style={{display: playList.length ? '' : 'none'}}
        >
            <CSSTransition classNames={'normal'}
                           timeout={600}
                           in={animation}
                           onEnter={onEnter}
                           onEntered={onEntered}
                           onExit={onExit}
                           onExited={closeFullScreen}>
                <div className={styles.normalPlayer}
                    // style={{display: fullScreen ? '' : 'none'}}
                >
                    <div className={styles.background}>
                        <img src={currentSong.pic} alt={'song'}/>
                    </div>
                    <div className={`${styles.top} top`}>
                        <div className={styles.back}
                             onClick={closeAnimation}
                        >
                            <i className={`icon-back ${styles.iconBack}`}/>
                        </div>
                        <h1 className={`${styles.title} no-wrap`}>{currentSong.name}</h1>
                        <h2 className={styles.subtitle}>{currentSong.singer}</h2>
                    </div>
                    <main className={styles.middle}
                          onTouchStartCapture={onMiddleTouchstart}
                          onTouchMoveCapture={onMiddleTouchmove}
                          onTouchEndCapture={onMiddleTouchend}
                    >
                        <div className={styles.middleL}
                             style={middleLStyle}
                        >
                            <div className={styles.cdWrapper}
                                 style={animationStyle}
                            >
                                <div className={styles.cd}>
                                    <img className={`image ${playing ? styles.running : styles.paused}`}
                                         src={currentSong.pic} alt={'song'}/>
                                </div>
                            </div>
                            <div className={styles.playingLyricWrapper}>
                                <div
                                    className={styles.playingLyric}>{playingLyric ? playingLyric : '歌词正在载入中~ ~ ~'}</div>
                            </div>
                        </div>
                        <Scroll className={styles.middleR}
                                ref={lyricScrollRef}
                                style={middleRStyle}
                        >
                            <div className={styles.lyricWrapper}>
                                {
                                    currentLyric ? <div ref={lyricListRef}>
                                        {
                                            currentLyric.lines.map((line, index) => (
                                                <p className={`${styles.text} ${currentLineNum === index ? styles.current : ''}`}
                                                   key={line.time}
                                                >
                                                    {line.txt}
                                                </p>
                                            ))
                                        }
                                    </div> : <></>
                                }
                                <div className={styles.pureMusic}
                                     style={{display: pureMusicLyric ? '' : 'none'}}
                                >
                                    <p>{pureMusicLyric}</p>
                                </div>
                            </div>
                        </Scroll>
                    </main>
                    <div className={`${styles.bottom} bottom`}>
                        <div className={styles.dotWrapper}>
                            <span className={`${styles.dot} ${currentShow === 'cd' ? styles.active : ''}`}/>
                            <span className={`${styles.dot} ${currentShow === 'lyric' ? styles.active : ''}`}/>
                        </div>
                        <div className={styles.progressWrapper}>
                            <span className={`${styles.time} ${styles.timeL}`}>{formatTime(currentTime)}</span>
                            <div className={styles.progressBarWrapper}>
                                <ProgressBar progress={progress}
                                             onProgressChanging={onProgressChanging}
                                             onProgressChanged={onProgressChanged}
                                />
                            </div>
                            <span className={`${styles.time} ${styles.timeR}`}>{formatTime(currentSong.duration)}</span>
                        </div>
                        <div className={styles.operators}>
                            <div className={`${styles.icon} ${styles.iLeft}`}>
                                <i className={modeIcon}
                                   onClick={togglePlayMode}
                                />
                            </div>
                            <div className={`${styles.icon} ${styles.iLeft}`}>
                                <i className="icon-prev"
                                   onClick={prevSong}
                                />
                            </div>
                            <div className={`${styles.icon} ${styles.iCenter}`}>
                                <i className={`${playing ? 'icon-pause' : 'icon-play'}`}
                                   onClick={togglePlaying}
                                />
                            </div>
                            <div className={`${styles.icon} ${styles.iRight}`}>
                                <i className="icon-next"
                                   onClick={nextSong}/>
                            </div>
                            <div className={`${styles.icon} ${styles.iRight}`}>
                                <i className={getFavoriteIcon}/>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
            <ProcessContext.Provider value={progress || 0}>
                <CSSTransition classNames={'mini'} timeout={600} appear={true} in={animation} mountOnEnter>
                    <MiniPlayer/>
                </CSSTransition>
            </ProcessContext.Provider>
            <audio ref={audioRef}
                   onTimeUpdate={ontimeupdate}
                   onPause={onpause}
                   onCanPlay={oncanplay}
                   onEnded={onended}
                   onError={onerror}
            />
        </div>
    )
}

export default Player
