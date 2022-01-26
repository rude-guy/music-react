import {useCallback, useEffect, useRef, useState} from 'react'
import Lyric from 'lyric-parser'
import {getLyric} from '../../services/song'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {addSongLyric, getCurrentSong} from '../../store/reducers'

interface LyricProps {
    currentTime: number
    songReady: boolean
}

/**
 * 自定义hooks
 * 歌词相关
 * @param currentTime
 * @param songReady
 */
const useLyric = ({currentTime, songReady}: LyricProps) => {
    // currentTime转存到Ref上防止死循环
    const currentTimeRef = useRef(currentTime)
    currentTimeRef.current = currentTime

    const currentSong = useAppSelector(getCurrentSong)
    // 用户缓存currentSongUrl，防止切换模式时导致currentSong变化重新获取歌词
    const cacheCurrentSongUrl = useRef('')

    const dispatch = useAppDispatch()
    const [currentLyric, setCurrentLyric] = useState<Lyric | null>(null)

    // currentLyric转存到Ref上防止死循环
    const currentLyricRef = useRef<Lyric | null>(null)
    currentLyricRef.current = currentLyric

    const [pureMusicLyric, setPureMusicLyric] = useState('')
    const [playingLyric, setPlayingLyric] = useState('')
    const [currentLineNum, setCurrentLineNum] = useState(0)
    const scrollCom = useRef<any>(null)
    const lyricScrollRef = useRef<any>(null)

    /**
     * 初始化Scroll组件获取Ref
     */
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

    /**
     * 歌词回调
     * @param lineNum: 当前播放歌词的行
     * @param txt: 当前播放歌词的内容
     */
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

    /**
     * 获取歌词数据
     */
    const getLyricData = useCallback(async () => {
        // 防止切换模式时导致currentSong变化重新获取歌词
        if (!currentSong.url || !currentSong.id || cacheCurrentSongUrl.current === currentSong.url) {
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
        cacheCurrentSongUrl.current = currentSong.url
        // 防止一直获取数据创建对象
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

    /**
     * 初始化获取歌词
     */
    useEffect(() => {
        getLyricData()
        return () => {
            if (cacheCurrentSongUrl.current === currentSong.url) return
            stopLyric()
            currentLyricRef.current = null
            setCurrentLyric(null)
        }
    }, [getLyricData])


    /**
     * 跳转歌词
     * @param currentTime
     */
    function playLyric (currentTime?: number) {
        if (currentLyricRef.current) {
            currentTime = currentTime != null ? currentTime : currentTimeRef.current
            currentLyricRef.current.seek(currentTime * 1000)
        }
    }

    /**
     * 停止跳转歌词
     */
    function stopLyric () {
        if (currentLyricRef.current) {
            currentLyricRef.current.stop()
        }
    }


    return {
        currentLyric, currentLineNum, playLyric, lyricScrollRef,
        lyricListRef, stopLyric, pureMusicLyric, playingLyric
    }
}

export default useLyric
