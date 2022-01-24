import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import styles from './UserCenter.module.css'
import Switches from '../../components/swtiches/Switches'
import Scroll from '../../components/scroll/Scroll'
import SongList from '../../components/songList/SongList'
import {useAppSelector} from '../../store/hooks'
import {selectMusic} from '../../store/reducers'
import {useHistory} from 'react-router-dom'
import {Song} from '../singer/singerDetail/SingerDetail'
import NoResult from '../../components/noResult/NoResult'
import {useCSSTranslation, useLoadScroll, useScrollStyle} from '../../utils/hooks'
import {CSSTransition} from 'react-transition-group'
import {addSong, randomPlay} from '../../store/actions'

const UserCenter = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const {playHistory, favoriteList} = useAppSelector(selectMusic)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentList, setCurrentList] = useState<Song[]>([])

    // 加载Scroll实例
    const {scrollRef, refreshScroll} = useLoadScroll(currentList)

    const playListStyle = useScrollStyle(refreshScroll, 'paddingBottom')

    /**
     * store状态改变时动态加载currentList
     */
    useEffect(() => {
        currentIndex === 0 ? setCurrentList(favoriteList) : setCurrentList(playHistory)
    }, [favoriteList, playHistory])

    /**
     * 切换Switches回调
     * @param index
     */
    const switchItem = (index: number) => {
        setCurrentIndex(index)
        index === 0 ? setCurrentList(favoriteList) : setCurrentList(playHistory)
        refreshScroll()
    }

    const selectSong = (song: Song) => {
        dispatch(addSong(song))
    }

    /**
     * 随机播放列表 指当个列表项
     */
    function random () {
        dispatch(randomPlay(currentList))
    }

    // 自定义简单动画
    const {visible, closeVisible} = useCSSTranslation()

    return (
        <CSSTransition in={visible} classNames={'slide'} appear={true} timeout={300} unmountOnExit
                       onExited={history.goBack}
        >
            <div className={styles.userCenter}>
                <div className={styles.back}>
                    <i className={`${styles.iconBack} icon-back`}
                       onClick={closeVisible}
                    />
                </div>
                <div className={styles.switchesWrapper}>
                    <Switches items={['我喜欢的', '最近播放']}
                              switchItem={switchItem}
                              modelIndex={currentIndex}
                    />
                </div>
                {
                    currentList.length ? <div className={styles.playBtn}
                                              onClick={random}
                    >
                        <i className={`${styles.iconPlay} icon-play`}/>
                        <span className={styles.text}>随机播放全部</span>
                    </div> : <NoResult title={currentIndex === 0? '暂无收藏歌曲' : '暂无最近播放历史'}/>
                }
                <div className={styles.listWrapper} style={playListStyle}>
                    <Scroll className={styles.listScroll}
                            ref={scrollRef}
                    >
                        <div className={styles.listInner}>
                            <SongList songs={currentList}
                                      onSelectItem={selectSong}
                            />
                        </div>
                    </Scroll>
                </div>
            </div>
        </CSSTransition>
    )
}

export default UserCenter
