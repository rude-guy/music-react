import React, {useCallback, useEffect, useState} from 'react'
import storage from 'good-storage'
import styles from './Singer.module.css'
import {getSingerList} from '../../services/singer'
import IndexList from './components/indexList/IndexList'
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom'
import {SingerDetail} from './singerDetail/SingerDetail'
import {SINGER_KEY} from '../../assets/ts/constant'
import Loading from '../../components/loading/Loading'

/*
 * 歌手数据结构
 */
export interface SingerInfo {
    id: number
    mid: string
    name: string
    pic: string
}

/*
 *  歌手列表的数据结构
 */
export interface SingerData {
    title: string
    list: SingerInfo[]
}

const Singer = () => {
    const [singers, setSingers] = useState<SingerData[]>([])
    const {path, url} = useRouteMatch()
    const history = useHistory()
    const [singerInfo, setSingerInfo] = useState<SingerInfo>()
    /**
     * 获取歌手列表
     */
    useEffect(() => {
        getSingerList().then(result => {
            setSingers(result)
        })
    }, [])

    /**
     * 歌手详情页跳转
     */
    const selectSinger = useCallback((singer: SingerInfo) => {
        setSingerInfo(singer)
        // 缓存数据
        storage.session.set(SINGER_KEY, singer)
        history.push(`${url}/${singer.mid}`)
    }, [url, history])


    return <div className={styles.singer}>
        {singers.length ? <IndexList singers={singers} selectSinger={selectSinger}/> : <Loading/>}
        <Switch>
            <Route path={`${path}/:singerId`}>
                <SingerDetail singerInfo={singerInfo}/>
            </Route>
        </Switch>
    </div>
}

export default Singer
