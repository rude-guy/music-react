import React, {useCallback, useMemo, useState} from 'react'
import styles from './MusicList.module.css'
import Scroll, {Pos} from '../scroll/Scroll'
import {Rest, Song} from '../../pages/singer/singerDetail/SingerDetail'
import Loading from '../loading/Loading'
import NoResult from '../noResult/NoResult'
import SongList from '../songList/SongList'
import {useLoadScroll} from '../../utils/hooks'
import {useStyle} from './useStyle'
import {useStore} from './useStore'
import {useHistory} from 'react-router-dom'
import {CSSTransition} from 'react-transition-group'

/**
 * MusicList组件Props
 */
type Props = {
    songs: Song[],
    noResult: boolean
    rank?: boolean
} & Rest

/**
 * 自定义hooks
 * 获取滚动Y坐标
  */
const useScroll = () => {
    const [scrollY, setScrollY] = useState(0)
    /**
     * 窃听滚动
     * @param pos: x,y轴坐标
      */
    const onScroll = useCallback((pos: Pos) => {
        setScrollY(-pos.y)
    }, [])
    return {scrollY, onScroll}
}

const MusicList: React.FC<Props> = (props) => {
    const {songs, pic, title, noResult, rank} = props
    const history = useHistory()
    const {scrollRef: musicRef, playListStyle: scrollStyle} = useLoadScroll(songs)
    // 获取滚动Y坐标
    const {scrollY, onScroll} = useScroll()

    // 计算样式的
    const { bgImage, bgImageStyle,filterStyle, playBtnStyle } = useStyle(scrollY, pic)

    // 派发store
    const {onSelectItem, onRandomPlaying} = useStore({songs})

    // 动画相关
    const [visible, setVisible] = useState(true)

    /**
     * 关闭动画
     */
    function close() {
        setVisible(false)
    }

    /**
     * 通过songs渲染所对应组件——对应的效果
     */
    const renderComponent = useMemo(() => {
        return songs.length ? <SongList songs={songs} onSelectItem={onSelectItem} rank={rank}/> :
            noResult ? <NoResult/> : <Loading/>
    }, [songs, onSelectItem, noResult])

    return (
        <CSSTransition classNames={'slide'} timeout={300} in={visible} appear={true} unmountOnExit onExited={() => history.goBack()}>
            <div className={styles.musicList}>
                <div className={styles.back} onClick={close}>
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
        </CSSTransition>
    )
}

MusicList.defaultProps = {
    noResult: false,
    rank: false
}

export default MusicList
