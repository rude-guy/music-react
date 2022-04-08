import React, {useEffect, useState} from 'react'
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom'
import storage from 'good-storage'
import styles from './Search.module.css'
import Scroll from '../../components/scroll/Scroll'
import Confirm from '../../components/player/subComponent/confirm/Confirm'
import SearchInput from '../../components/search/searchInput/SearchInput'
import SearchList from '../../components/searchList/SearchList'
import Suggest from '../../components/search/suggest/Suggest'
import {getHotKeys} from '../../services/search'
import SingerDetail, {Song} from '../singer/singerDetail/SingerDetail'
import {SingerInfo} from '../singer/Singer'
import {useAppDispatch} from '../../store/hooks'
import {addSong} from '../../store/actions'
import {SINGER_KEY} from '../../assets/ts/constant'
import useConfirm from '../../components/player/subComponent/confirm/useConfirm'
import {useLoadScroll} from '../../utils/hooks'
import {useSearchHistory} from './useSearchHistory'


/**
 * 热门关键词数据结构
 */
export interface HotKey {
    id: number
    key: string
}

/**
 * 自定义hooks
 * 点击搜索中的结果逻辑
 * @param saveSearchKey: 保存搜索关键词
 * @param query:  搜索关键词
 */
const useSearchKey = (saveSearchKey: (query: string) => void, query: string) => {
    const dispatch = useAppDispatch()
    const {url, path} = useRouteMatch()
    const history = useHistory()
    // 搜索选择的歌手
    const [selectedSinger, setSelectedSinger] = useState<SingerInfo>()
    /**
     * Suggest组件
     * 搜索歌曲所点击的歌曲的回调
     * @param song
     */
    const selectItemSong = (song: Song) => {
        saveSearchKey(query)
        dispatch(addSong(song))
    }
    /**
     * Suggest组件
     * 搜索歌曲所点击的歌手的回调
     * @param singer
     */
    const selectItemSinger = (singer: SingerInfo) => {
        saveSearchKey(query)
        setSelectedSinger(singer)
        storage.session.set(SINGER_KEY, singer)
        history.push(`${url}/${singer.mid}`)
    }

    return {
        selectItemSinger, selectItemSong,
        selectedSinger, path
    }
}

const Search = () => {
    const [hotkeys, setHotKeys] = useState<HotKey[]>([])
    const [query, setQuery] = useState('')

    /**
     * 初始化热门关键词
     */
    useEffect(() => {
        getHotKeys().then(res => {
            setHotKeys(res.hotKeys)
        })
    }, [])

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
     * 选择关键词或历史记录
     * @param query
     */
    const selectQuery = (query: string) => {
        setQuery(query)
        saveSearchKey(query)
    }

    // 搜索历史
    const {searchHistory, saveSearchKey, deleteSearchKey, clearSearch} = useSearchHistory()

    // 搜索歌曲
    const {selectItemSong, selectItemSinger, selectedSinger, path} = useSearchKey(saveSearchKey, query)

    // 显示Confirm对话框
    const { confirmRef, openConfirm} = useConfirm()


    const {scrollRef, playListStyle} = useLoadScroll([hotkeys, searchHistory])

    return (
        <div className={styles.search}
             style={playListStyle}
        >
            <div className={styles.searchInputWrapper}>
                <SearchInput value={query}
                             onChange={onchange}
                             onClose={onclose}
                />
            </div>
            <Scroll ref={scrollRef}
                    className={styles.searchContent}
                    style={{display: query ? 'none' : ''}}
            >
                <div>
                    <div className={styles.hotKeys}>
                        <h1 className={styles.title}>热门搜索</h1>
                        <ul>
                            {
                                hotkeys.map(hotkey => (
                                    <li className={styles.item}
                                        key={hotkey.id}
                                        onClick={() => selectQuery(hotkey.key)}
                                    >
                                        <span>{hotkey.key}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className={styles.searchHistory}
                         style={{display: searchHistory.length ? '' : 'none'}}
                    >
                        <h1 className={styles.title}>
                            <span className={styles.text}>搜索历史</span>
                            <span className="clear extend-click"
                                  onClick={openConfirm}
                            >
                                <i className={`icon-clear ${styles.iconClear}`}/>
                            </span>
                        </h1>
                        <Confirm ref={confirmRef}
                                 text="是否清空所有搜索历史"
                                 confirmBtnText="清空"
                                 confirm={clearSearch}
                        />
                        <SearchList searches={searchHistory}
                                    deleteKey={deleteSearchKey}
                                    selectHistory={selectQuery}
                        />
                    </div>
                </div>
            </Scroll>
            <div className={styles.searchResult}
                 style={{display: query ? '' : 'none'}}
            >
                <Suggest
                    query={query}
                    selectItemSong={selectItemSong}
                    selectItemSinger={selectItemSinger}
                />
            </div>
            <Switch>
                <Route path={`${path}/:singerId`}>
                    <SingerDetail singerInfo={selectedSinger}/>
                </Route>
            </Switch>
        </div>
    )
}

export default Search
