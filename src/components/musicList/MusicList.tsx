import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import styles from './MusicList.module.css'
import Scroll, {Pos} from '../scroll/Scroll'
import {Rest, Song} from '../../pages/singer/singerDetail/SingerDetail'
import {useHistory} from 'react-router-dom'
import {useComputed} from '../../utils/public'
import {NumberOrString} from '../../types'
import Loading from '../loading/Loading'
import NoResult from '../noResult/NoResult'
import SongList from '../songList/SongList'

type Props = {
    songs: Song[],
    noResult: boolean
} & Rest

const RESERVED_HEIGHT = 40  // tab高度

const useScroll = () => {
    const [scrollY, setScrollY] = useState(0)
    // 窃听滚动
    const onScroll = useCallback((pos: Pos) => {
        setScrollY(-pos.y)
    }, [])
    return {scrollY, onScroll}
}

const MusicList: React.FC<Props> = (props) => {
    const {songs, pic, title, noResult = false} = props
    const history = useHistory()
    const musicRef = useRef(null)
    const imageHeight = useRef(0) // 图片的高度
    const maxTranslateY = useRef(0) // 最大偏移高度
    const {scrollY, onScroll} = useScroll()
    const bgImage = useCallback((node: HTMLImageElement) => {
        if (node != null) {
            setTimeout(() => {
                imageHeight.current = node.clientHeight
                maxTranslateY.current = imageHeight.current - RESERVED_HEIGHT
            }, 0)
        }
    }, [])

    // 挂载 scroll刷新
    useEffect(() => {
        let timer: any
        if (musicRef != null) {
            timer = setTimeout(() => {
                (musicRef.current as any).refresh()
            }, 0)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [songs])

    // 模糊背景样式
    const filterStyle = useComputed<React.CSSProperties>(() => {
        let blur = 0
        if (scrollY >= 0) {
            blur = Math.min(maxTranslateY.current / imageHeight.current, scrollY / imageHeight.current) * 0.5
        }
        return {
            backdropFilter: `blur(${blur}rem)`
        }
    }, [scrollY])

    // 背景图片样式
    const bgImageStyle = useComputed<React.CSSProperties>(() => {
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
            transform: `scale(${scale})translateZ(${translateZ}px)`
        }
    }, [scrollY, pic])

    // 随机播放按钮
    const playBtnStyle = useComputed<React.CSSProperties>(() => {
        return {
            display: scrollY > maxTranslateY.current ? 'none' : ''
        }
    }, [scrollY])

    // 渲染组件
    const renderComponent = useMemo(() => {
        return songs.length ? <SongList songs={songs} /> :
            noResult ? <NoResult/> : <Loading />
    }, [songs, noResult])

    return (
        <div className={styles.musicList}>
            <div className={styles.back} onClick={() => history.goBack()}>
                <i className={`icon-back ${styles.iconBack}`}/>
            </div>
            <h1 className={`${styles.title} no-wrap`}>{title}</h1>
            <div className={styles.bgImage}
                 ref={bgImage}
                 style={{...bgImageStyle, backgroundImage: `url(${pic})`}}
            >
                <div className={styles.playBtnWrapper}>
                    <div className={styles.playBtn}
                         style={playBtnStyle}
                    >
                        <i className={`icon-play ${styles.iconPlay}`}/>
                        <span className={styles.text}>随机播放全部</span>
                    </div>
                </div>
                <div className={styles.filter}
                     style={filterStyle}/>
            </div>
            <Scroll className={styles.list}
                    style={{bottom: songs.length ? '.6rem' : '0'}}
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
