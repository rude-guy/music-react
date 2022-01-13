import React from 'react'
import {NavLink} from 'react-router-dom'
import styles from './Tabs.module.css'

interface tab {
    name: string
    to: {
        pathname: string
    }
}

const tabs: tab[] = [
    {
        name: '推荐',
        to: {pathname: '/Recommend'}
    },
    {
        name: '歌手',
        to: {pathname: '/Singer'}
    },
    {
        name: '排行',
        to: {pathname: '/TopList'}
    },
    {
        name: '搜索',
        to: {pathname: '/search'}
    }
]

const Tabs = () => {
    return (
        <ul className={styles.tabWrap}>
            {
                tabs.map(tab => {
                    return <li className={styles.tabItem}>
                        <NavLink to={tab.to}
                                 className={styles.tabLink}
                                 activeClassName={styles.routerLinkActive}
                        >
                            {tab.name}
                        </NavLink>
                    </li>
                })
            }
        </ul>
    )
}

export default Tabs
