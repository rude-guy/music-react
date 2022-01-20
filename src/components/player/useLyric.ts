import {useCallback, useEffect, useRef, useState} from 'react'
import Lyric from 'lyric-parser'
import {getLyric} from '../../services/song'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {addSongLyric, getCurrentSong} from '../../store/reducers'

interface LyricProps {
    currentTime: number
    songReady: boolean
}

const useLyric = ({currentTime, songReady}: LyricProps) => {
    const currentTimeRef = useRef(currentTime)
    currentTimeRef.current = currentTime

    const currentSong = useAppSelector(getCurrentSong)
    const dispatch = useAppDispatch()
    const [currentLyric, setCurrentLyric] = useState<Lyric | null>(null)

    const currentLyricRef = useRef<Lyric | null>(null)
    currentLyricRef.current = currentLyric

    const [pureMusicLyric, setPureMusicLyric] = useState('')
    const [playingLyric, setPlayingLyric] = useState('')
    const [currentLineNum, setCurrentLineNum] = useState(0)
    const scrollCom = useRef<any>(null)
    const lyricScrollRef = useRef<any>(null)

    useEffect(() => {
        let timer: any
        if (lyricScrollRef.current) {
            scrollCom.current = lyricScrollRef.current.getBScroll()
            timer = setTimeout(() => {
                lyricScrollRef.current.refresh()
            }, 0)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [currentLyric])

    const lyricListRef = useRef<HTMLDivElement>(null)

    // 跳转歌词
    function playLyric (currentTime?: number) {
        if (currentLyricRef.current) {
            currentTime = currentTime != null ? currentTime : currentTimeRef.current
            currentLyricRef.current.seek(currentTime * 1000)
        }
    }

    // 停止跳转歌词
    function stopLyric () {
        if (currentLyricRef.current) {
            currentLyricRef.current.stop()
        }
    }

    function handleLyric ({lineNum, txt}: { lineNum: number; txt: string }) {
        setCurrentLineNum(lineNum)
        setPlayingLyric(txt)
        if (!scrollCom.current || lyricListRef.current == null) {
            return
        }
        if (lineNum > 5) {
            const lineEl = lyricListRef.current.children[lineNum - 5]
            scrollCom.current.scrollToElement(lineEl, 1000)
        } else {
            scrollCom.current.scrollTo(0, 0, 1000)
        }
    }

    const getLyricData = useCallback(async () => {
        if (!currentSong.url || !currentSong.id) {
            return
        }
        stopLyric()
        setCurrentLineNum(0)
        setCurrentLyric(null)
        setPureMusicLyric('')
        setPlayingLyric('')
        let lyric: string = await getLyric(currentSong)
        dispatch(addSongLyric({
            song: currentSong,
            lyric: lyric
        }))
        if (currentSong.lyric !== lyric) return
        const currentLyric = new Lyric(lyric, handleLyric)
        if (currentLyricRef.current === currentLyric) {
            return
        }
        setCurrentLyric(currentLyric)
        const hasLyric = currentLyric.lines.length
        if (hasLyric) {
            setPlayingLyric(currentLyric.lines[0].txt)
            if (songReady) {
                playLyric()
            }
        } else {
            const newLyric = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})]/g, '')
            setPlayingLyric(newLyric)
            setPureMusicLyric(newLyric)
        }
    }, [currentSong, dispatch])

    useEffect(() => {
        getLyricData()
        return () => {
            stopLyric()
            currentLyricRef.current = null
            setCurrentLyric(null)
        }
    }, [getLyricData])

    return {
        currentLyric, currentLineNum, playLyric, lyricScrollRef,
        lyricListRef, stopLyric, pureMusicLyric, playingLyric
    }
}

export default useLyric
