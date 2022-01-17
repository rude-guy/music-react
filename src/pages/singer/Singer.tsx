import React, {useCallback, useEffect, useState} from 'react'
import storage from 'good-storage'
import styles from './Singer.module.css'
import {getSingerList} from '../../services/singer'
import IndexList from './components/indexList/IndexList'
import {Route, Switch, useHistory , useRouteMatch} from 'react-router-dom'
import {SingerDetail} from './singerDetail/SingerDetail'
import {SINGER_KEY} from '../../assets/ts/constant'
import Loading from '../../components/loading/Loading'

export interface SingerInfo {
    id: number
    mid: string
    name: string
    pic: string
}

export interface SingerData {
    title: string
    list: SingerInfo[]
}

const Singer = () => {
    const [singers, setSingers] = useState<SingerData[]>([])
    const {path, url} = useRouteMatch()
    const history = useHistory()
    useEffect(() => {
        const getData = async () => {
            const result = await getSingerList()
            setSingers(result)
        }
        getData()
    }, [])

    const selectSinger = useCallback((singer: SingerInfo) => {
        // TODO 跳转详情页
        console.log(singer)
        // 缓存数据
        storage.session.set(SINGER_KEY, singer)
        history.push(`${url}/${singer.mid}`)
    }, [url, history])
    return (
        <div className={styles.singer}>
            <Switch>
                <Route exact path={`${path}`}>
                    {singers.length ? <IndexList singers={singers} selectSinger={selectSinger}/> : <Loading />}
                </Route>
                <Route path={`${path}/:singerId`} component={SingerDetail} />
            </Switch>
        </div>
    )
}

export default Singer
