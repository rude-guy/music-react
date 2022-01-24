import React, {ForwardedRef, useImperativeHandle, useRef, useState} from 'react'
import styles from './AddSong.module.css'
import SearchInput from '../../../search/searchInput/SearchInput'
import Scroll from '../../../scroll/Scroll'
import SongList from '../../../songList/SongList'
import Suggest from '../../../search/suggest/Suggest'
import Message from '../../../message/Message'
import {stopPropagation} from '../../../../utils/public'
import {useDispatch} from 'react-redux'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {selectMusic, setFullScreen} from '../../../../store/reducers'
import {Song} from '../../../../pages/singer/singerDetail/SingerDetail'
import Switches from '../../../swtiches/Switches'
import SearchList from '../../../searchList/SearchList'
import {addSong} from '../../../../store/actions'
import NoResult from '../../../noResult/NoResult'
import {useSearchHistory} from '../../../../pages/search/useSearchHistory'
import {useCSSTranslation} from '../../../../utils/hooks'
import {CSSTransition} from 'react-transition-group'

interface Props {
    ref: ForwardedRef<any>
}

const useCloseFullScreen = (delay = 100) => {
    const dispatch = useAppDispatch()
    let timer = useRef<any>()
    function closeFullScreen () {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            dispatch(setFullScreen(false))
        }, delay)
    }
    return {closeFullScreen}
}

const AddSong: React.FC<Props> = React.forwardRef((props, ref) => {
    const [query, setQuery] = useState('')
    const dispatch = useDispatch()
    const {playHistory, searchHistory} = useAppSelector(selectMusic)
    const [currentIndex, setCurrentIndex] = useState(0)

    // 弹窗转发的ref
    const messageRef = useRef<any>(null)

    // 进场和出场动画
    const { visible, closeVisible, showVisible } = useCSSTranslation(false)

    const {closeFullScreen} = useCloseFullScreen()

    /**
     * 把进场动画转发出去
     */
    useImperativeHandle(ref, () => ({
        showVisible
    }))

    /**
     * 输入框数据绑定
     * @param e
     */
    const onchange = (e: React.FormEvent) => {
        setQuery((e.target as any).value)
        e.preventDefault()
    }

    /**
     * 清空输入框数据
     */
    const onclose = () => {
        setQuery('')
    }

    /**
     * 切换Switches回调
     * @param index
     */
    const switchItem = (index: number) => {
        setCurrentIndex(index)
    }

    /**
     * SongList回调添加歌曲
     * @param song
     */
    const onSelectItem = (song: Song) => {
        dispatch(addSong(song))
        messageRef.current?.show()
        closeFullScreen()
    }

    /**
     * SearchList组件回调
     * @param query
     */
    const addQuery = (query: string) => {
        setQuery(query)
    }

    // 保存搜索记录
    const {saveSearchKey} = useSearchHistory()

    /**
     * Suggest组件
     * 搜索歌曲所点击的歌曲的回调
     * @param song
     */
    const selectItemSong = (song: Song) => {
        dispatch(addSong(song))
        saveSearchKey(query)
        messageRef.current?.show()
        closeFullScreen()
    }

    return (
        <CSSTransition classNames={'slide'} timeout={300} in={visible} appear={true} unmountOnExit>
            <div className={styles.addSong} onClick={stopPropagation}>
                <div className={styles.header}>
                    <h1 className={styles.title}>添加歌曲到列表</h1>
                    <div className={styles.close}
                         onClick={closeVisible}
                    >
                        <i className={`${styles.iconClose} icon-close`}/>
                    </div>
                </div>
                <div className={styles.searchInputWrapper}>
                    <SearchInput
                        value={query}
                        onChange={onchange}
                        onClose={onclose}
                        placeholder={'搜索歌曲'}
                    />
                </div>
                <div className={'list'}
                     style={{display: query ? 'none' : ''}}
                >
                    <Switches modelIndex={currentIndex}
                              items={['最近播放', '搜索历史']}
                              switchItem={switchItem}
                    />
                    <div className={styles.listWrapper}>
                        {
                            currentIndex === 0 ? (
                                playHistory.length ? <Scroll className={styles.listScroll}>
                                    <div className={styles.listInner}>
                                        <SongList songs={playHistory}
                                                  onSelectItem={onSelectItem}
                                        />
                                    </div>
                                </Scroll> : <NoResult title={'暂无最近播放历史'}/>
                            ) : (
                                searchHistory.length ? <Scroll className={styles.listScroll}>
                                    <div className={styles.listInner}>
                                        <SearchList searches={searchHistory}
                                                    showDelete={false}
                                                    selectHistory={addQuery}
                                        />
                                    </div>
                                </Scroll> : <NoResult title={'暂无最近搜索历史'}/>
                            )
                        }
                    </div>
                </div>
                <div className={styles.searchResult}
                     style={{display: query ? '' : 'none'}}
                >
                    <Suggest query={query}
                             showSinger={false}
                             selectItemSong={selectItemSong}
                    />
                </div>
                <Message ref={messageRef} delay={1500}>
                    <div className={styles.messageTitle}>
                        <i className={`${styles.iconOk} icon-ok`}/>
                        <span className={styles.text}>1首歌曲已经添加到播放列表</span>
                    </div>
                </Message>
            </div>
        </CSSTransition>
    )
})

export default AddSong
