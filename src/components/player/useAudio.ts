// 播放状态
import React, {useCallback, useEffect} from 'react'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {getCurrentSong, PLAY_MODE, selectMusic, setCurrentIndex, setPlayingState} from '../../store/reducers'

export type AudioRef = {
    audioRef: React.RefObject<HTMLAudioElement>
}

type AudioState = {
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>
    setSongReady: React.Dispatch<React.SetStateAction<boolean>>
    playLyric: () => void
    stopLyric: () => void
} & AudioRef

type Audio = {
    songReady: boolean
    progressChanging: boolean,
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>
    setSongReady: React.Dispatch<React.SetStateAction<boolean>>
} & AudioRef

/**
 * 自定义hooks
 * 播放状态相关
 * @param audioRef: audio Dom元素的Ref
 * @param setCurrentTime
 * @param setSongReady
 * @param playLyric: 跳转歌词
 * @param stopLyric: 停止跳转歌词
 */
export const useAudioState = ({audioRef, setCurrentTime, setSongReady, playLyric, stopLyric}: AudioState) => {
    const currentSong = useAppSelector(getCurrentSong)
    const {playing} = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()

    /**
     * 窃听当前歌曲变化
     */
    useEffect(() => {
        const audioVal = audioRef.current
        if (!currentSong.id || !currentSong.url || audioVal == null) {
            // 防止播放器二次调用play()导致错误
            audioVal?.pause()
            audioVal?.load()
            return
        }
        setSongReady(false)
        setCurrentTime(0)
        if (audioVal.src !== currentSong.url) {
            audioVal.src = currentSong.url
            audioVal.play()
            dispatch(setPlayingState(true))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, currentSong])

    /**
     * 窃听当前播放状态
     */
    useEffect(() => {
        const audioVal = audioRef.current
        if (audioVal == null) return
        if (playing) {
            audioVal.play()
            playLyric()
        } else {
            audioVal.pause()
            stopLyric()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing])
    return {audioRef, currentSong}
}

/**
 * 自定义hooks
 * 播放暂停切换
 */
export const useTogglePlaying = () => {
    const dispatch = useAppDispatch()
    const {playing} = useAppSelector(selectMusic)
    // 播放暂停切换
    return useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch(setPlayingState(!playing))
    }, [dispatch, playing])
}

/**
 * 自定义hooks
 * 播放器切换歌曲相关
 * @param songReady
 * @param setSongReady
 * @param setCurrentTime
 * @param audioRef:  audio Dom元素的Ref
 * @param progressChanging: 移动进度条 move
 */
const useAudio = ({
                      songReady, setSongReady, setCurrentTime,
                      audioRef, progressChanging
                  }: Audio
) => {
    const {
        playMode, currentIndex, playList
    } = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()

    /**
     * 循环播放
     */
    const loop = useCallback(() => {
        const audioVal = audioRef.current
        if (audioVal === null) return
        audioVal.currentTime = 0
        audioVal.play()
        dispatch(setPlayingState(true))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    /**
     * 上一首
     */
    const prevSong = useCallback(() => {
        const playLen = playList.length
        if (!playLen || !songReady) return
        if (playLen === 1) {
            loop()
            return
        }
        const index = currentIndex === 0 ? playLen - 1 : currentIndex - 1
        dispatch(setCurrentIndex(index))
    }, [dispatch, playList, currentIndex, loop, songReady])


    /**
     * 下一首
     */
    const nextSong = useCallback(() => {
        const playLen = playList.length
        if (!playLen || !songReady) return
        if (playLen === 1) {
            loop()
            return
        }
        const index = playLen - 1 === currentIndex ? 0 : currentIndex + 1
        dispatch(setCurrentIndex(index))
    }, [dispatch, playList, currentIndex, songReady, loop])

    /**
     * 更新播放时间
     */
    const ontimeupdate = useCallback((e) => {
        if (progressChanging) return
        setCurrentTime(e.target.currentTime)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progressChanging])

    /**
     *  窃听audio标签暂停事件
     */
    const onpause = useCallback(() => {
        dispatch(setPlayingState(false))
    }, [dispatch])

    /**
     * 监听audio音频是否准备完成
     */
    const oncanplay = useCallback(() => {
        if (songReady) return
        setSongReady(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [songReady])

    /**
     * 监听audio音频播放结束
     */
    const onended = useCallback(() => {
        playMode === PLAY_MODE.loop ? loop() : nextSong()
    }, [playMode, nextSong, loop])

    /**
     * 监听audio音频播放错误
     */
    const onerror = useCallback(() => {
        setSongReady(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        ontimeupdate, onpause, oncanplay,
        onended, onerror,
        prevSong, nextSong
    }
}

export default useAudio
