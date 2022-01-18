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
} & AudioRef

type Audio = {
    songReady: boolean
} & AudioState

export const useAudioState = ({audioRef, setCurrentTime, setSongReady}: AudioState) => {
    const currentSong = useAppSelector(getCurrentSong)
    const {playing} = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()
    // 窃听当前歌曲变化
    useEffect(() => {
        const audioVal = audioRef.current
        if (!currentSong.id || !currentSong.url || audioVal == null) return
        setSongReady(false)
        setCurrentTime(0)
        audioVal.src = currentSong.url
        audioVal.play()
        dispatch(setPlayingState(true))
    }, [currentSong])
    // 窃听当前播放状态
    useEffect(() => {
        const audioVal = audioRef.current
        if (audioVal == null) return
        playing ? audioVal.play() : audioVal.pause()
    }, [playing])
    return {audioRef, currentSong}
}


export const useAudio = ({songReady, setSongReady, setCurrentTime, audioRef}: Audio) => {
    const {
        playMode, currentIndex, playList,
        playing
    } = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()

    const loop = useCallback(() => {
        const audioVal = audioRef.current
        if (audioVal === null) return
        audioVal.currentTime = 0
        audioVal.play()
        dispatch(setPlayingState(true))
    }, [dispatch])

    // 上一首
    const prevSong = useCallback(() => {
        const playLen = playList.length - 1
        if (!playLen || !songReady) return
        if (playLen === 1) {
            loop()
            return
        }
        const index = currentIndex === 0 ? playLen : currentIndex - 1
        dispatch(setCurrentIndex(index))
    }, [dispatch, playList, currentIndex, loop, songReady])


    // 下一首
    const nextSong = useCallback(() => {
        const playLen = playList.length - 1
        if (!playLen || !songReady) return
        if (playLen === 1) {
            loop()
            return
        }
        const index = playLen === currentIndex ? 0 : currentIndex + 1
        dispatch(setCurrentIndex(index))
    }, [dispatch, playList, currentIndex, songReady, loop])

    const ontimeupdate = useCallback((e) => {
        setCurrentTime(e.target.currentTime)
    }, [])

    // 窃听audio标签暂停事件
    const onpause = useCallback(() => {
        dispatch(setPlayingState(false))
    }, [dispatch])

    // 窃听audio音频是否准备完成
    const oncanplay = useCallback(() => {
        if (songReady) return
        setSongReady(true)
    }, [songReady])

    // 窃听audio音频播放结束
    const onended = useCallback(() => {
        playMode === PLAY_MODE.loop ? loop() : nextSong()
    }, [playMode, nextSong, loop])

    // 窃听audio音频播放错误
    const onerror = useCallback(() => {
        setSongReady(true)
    }, [])
    // 播放暂停切换
    const togglePlaying = useCallback(() => {
        dispatch(setPlayingState(!playing))
    }, [dispatch, playing])

    return {
        ontimeupdate, onpause, oncanplay,
        onended, onerror,
        prevSong, nextSong, togglePlaying
    }
}
