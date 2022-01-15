import React, {useEffect, useState} from 'react'
import styles from './Singer.module.css'
import {getSingerList} from '../../services/singer'
import IndexList from './components/indexList/IndexList'

export interface ListItem {
    id: number
    mid: string
    name: string
    pic: string
}

export interface SingerData {
    title: string
    list: ListItem[]
}

const Singer = () => {
    const [singers, setSingers] = useState<SingerData[]>([])
    useEffect(() => {
        const getData = async () => {
            const result = await getSingerList()
            setSingers(result)
        }
        getData()
    }, [])
    return (
        <div className={styles.singer}>
            <IndexList singers={singers} />
        </div>
    )
}

export default Singer
