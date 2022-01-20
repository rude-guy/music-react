import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {getCurrentSong, selectMusic, setPlayingState} from '../../store/reducers'
import React, {useCallback, useMemo, useState} from 'react'
import {AudioRef} from './useAudio'

type UseProgress = {
    currentTime: number
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
    playLyric: (currentTime?: number) => void
    stopLyric: () => void
} & AudioRef

const useProgress = ({currentTime, setCurrentTime, audioRef, playLyric, stopLyric}: UseProgress) => {
    const currentSong = useAppSelector(getCurrentSong)
    const {playing} = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()
    const [progressChanging, setProgressChanging] = useState(false)
    // 歌曲进度比例
    const progress = useMemo(() => {
        return currentTime / currentSong.duration
    }, [currentTime, currentSong])

    // 移动进度条
    const onProgressChanging = useCallback((progress: number) => {
        setProgressChanging(true)
        setCurrentTime(progress * currentSong.duration)
        playLyric()
        stopLyric()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong])

    const onProgressChanged = useCallback((progress: number) => {
        setProgressChanging(false)
        const currentTime = progress * currentSong.duration
        setCurrentTime(() => currentTime)
        // debugger
        playLyric(currentTime)
        if (!playing) dispatch(setPlayingState(true))
        if (audioRef.current == null) return
        audioRef.current.currentTime = currentTime
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, currentSong, playing])
    return {
        progressChanging, progress,
        onProgressChanging, onProgressChanged
    }
}

export default useProgress
