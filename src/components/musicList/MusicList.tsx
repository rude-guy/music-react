import React, {useCallback, useMemo, useRef, useState} from 'react'
import styles from './MusicList.module.css'
import Scroll, {Pos} from '../scroll/Scroll'
import {Rest, Song} from '../../pages/singer/singerDetail/SingerDetail'
import {NumberOrString} from '../../types'
import Loading from '../loading/Loading'
import NoResult from '../noResult/NoResult'
import SongList from '../songList/SongList'
import {randomPlay, selectPlay} from '../../store/actions'
import {useAppDispatch} from '../../store/hooks'
import {useLoadScroll} from '../../utils/hooks'

type Props = {
    songs: Song[],
    noResult: boolean
    goBack (): void
} & Rest

const RESERVED_HEIGHT = 40  // tab高度

// 获取滚动Y坐标
const useScroll = () => {
    const [scrollY, setScrollY] = useState(0)
    // 窃听滚动
    const onScroll = useCallback((pos: Pos) => {
        setScrollY(-pos.y)
    }, [])
    return {scrollY, onScroll}
}

// 计算样式的
const useStyle = (scrollY: number, pic: string) => {
    const imageHeight = useRef(0) // 图片的高度
    const maxTranslateY = useRef(0) // 最大偏移高度

    // 初始化Image的高度
    const bgImage = useCallback((node: HTMLImageElement) => {
        if (node != null) {
            setTimeout(() => {
                imageHeight.current = node.clientHeight
                maxTranslateY.current = imageHeight.current - RESERVED_HEIGHT
            }, 0)
        }
    }, [])

    // 模糊背景样式
    const filterStyle = useMemo<React.CSSProperties>(() => {
        let blur = 0
        if (scrollY >= 0) {
            blur = Math.min(maxTranslateY.current / imageHeight.current, scrollY / imageHeight.current) * 0.5
        }
        return {
            backdropFilter: `blur(${blur}rem)`
        }
    }, [scrollY])

    // 背景图片样式
    const bgImageStyle = useMemo<React.CSSProperties>(() => {
        let zIndex = 0
        let paddingTop: NumberOrString = '70%'
        let height: NumberOrString = 0
        let translateZ = 0
        if (scrollY > maxTranslateY.current) {
            zIndex = 10
            paddingTop = 0
            height = RESERVED_HEIGHT / 100 + 'rem'
            translateZ = 1
        }
        let scale = 1
        if (scrollY < 0) {
            scale = 1 + Math.abs(scrollY / imageHeight.current)
        }
        return {
            height,
            paddingTop,
            translateZ,
            zIndex,
            backgroundImage: `url(${pic})`,
            transform: `scale(${scale})translateZ(${translateZ}px)`
        }
    }, [scrollY, pic])

    // 随机播放按钮
    const playBtnStyle = useMemo<React.CSSProperties>(() => {
        return {
            display: scrollY > maxTranslateY.current ? 'none' : ''
        }
    }, [scrollY])

    return {
        bgImage, bgImageStyle,
        filterStyle, playBtnStyle
    }
}

// 派发store
const useStore = ({songs}: { songs: Song[] }) => {
    const dispatch = useAppDispatch()
    // 选择歌曲
    const onSelectItem = useCallback((song: Song, index: number) => {
        dispatch(selectPlay({list: songs, index}))
    }, [dispatch, songs])

    // 随机播放
    const onRandomPlaying = useCallback(() => {
        dispatch(randomPlay(songs))
    }, [dispatch, songs])

    return {
        onSelectItem,
        onRandomPlaying,
    }
}

const MusicList: React.FC<Props> = (props) => {
    const {songs, pic, title, noResult = false, goBack} = props

    const {scrollRef: musicRef, playListStyle: scrollStyle} = useLoadScroll(songs)
    // 获取滚动Y坐标
    const {scrollY, onScroll} = useScroll()
    // 计算样式的
    const {
        bgImage, bgImageStyle,
        filterStyle, playBtnStyle
    } = useStyle(scrollY, pic)

    // 派发store
    const {
        onSelectItem, onRandomPlaying,
    } = useStore({songs})

    // 渲染组件
    const renderComponent = useMemo(() => {
        return songs.length ? <SongList songs={songs} onSelectItem={onSelectItem}/> :
            noResult ? <NoResult/> : <Loading/>
    }, [songs, onSelectItem, noResult])

    return (
        <div className={styles.musicList}>
            <div className={styles.back} onClick={goBack}>
                <i className={`icon-back ${styles.iconBack}`}/>
            </div>
            <h1 className={`${styles.title} no-wrap`}>{title}</h1>
            <div className={styles.bgImage}
                 ref={bgImage}
                 style={bgImageStyle}
            >
                <div className={styles.playBtnWrapper}>
                    <div className={styles.playBtn}
                         style={playBtnStyle}
                    >
                        <i className={`icon-play ${styles.iconPlay}`}/>
                        <span className={styles.text} onClick={onRandomPlaying}>随机播放全部</span>
                    </div>
                </div>
                <div className={styles.filter}
                     style={filterStyle}/>
            </div>
            <Scroll className={styles.list}
                    style={scrollStyle}
                    onScroll={onScroll}
                    probeType={3}
                    ref={musicRef}
            >
                {renderComponent}
            </Scroll>
        </div>
    )
}

export default MusicList
