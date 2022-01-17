import React, {useCallback, useEffect, useRef, useState} from 'react'
import styles from './IndexList.module.css'
import {SingerInfo, SingerData} from '../../Singer'
import useFixed from './useFixed'
import useShortcut from './useShortcut'

type Props = {
    singers: SingerData[]
    selectSinger: (singer: SingerInfo) => void
}

const IndexList: React.FC<Props> = ({singers, selectSinger}) => {
    const {
        scrollRef, groupRef, fixedTitle, fixedStyle,
        currenIndex, scrollTo
    } = useFixed({singers})

    const [onShortcutTouchStart, onShortcutTouchMove] = useShortcut(scrollTo)

    return (
        <>
            <div className={styles.indexList}
                 ref={scrollRef}
            >
                <ul className={styles.scrollList}
                    ref={groupRef}
                >{
                    singers?.length ? singers.map(singer => {
                        return <li className={styles.group} key={singer.title}>
                            <h2 className={styles.title}>{singer.title}</h2>
                            <ul>{
                                singer?.list.map(item => {
                                    return <li className={styles.item}
                                               key={item.id}
                                               onClick={() => selectSinger(item)}
                                    >
                                        <img className={styles.avatar} src={item.pic} alt={'avatar'}/>
                                        <span className={styles.name}>{item.name}</span>
                                    </li>
                                })
                            }</ul>
                        </li>
                    }) : <div>loading</div>
                }</ul>
            </div>
            {
                fixedTitle ? <div
                    className={styles.fixed}
                    style={fixedStyle}
                >
                    <div className={styles.fixedTitle}>{fixedTitle}</div>
                </div> : <></>
            }
            <div className={styles.shortcut}
                 onTouchStartCapture={onShortcutTouchStart}
                 onTouchMoveCapture={onShortcutTouchMove}
                 onTouchEndCapture={() => {
                 }}
            >
                <ul>{
                    singers.map((singer, index) => {
                        return <li className={`${styles.item} ${currenIndex === index ? styles.current : ''}`}
                                   key={singer.title}
                                   data-index={index}
                        >
                            {singer.title}
                        </li>
                    })
                }</ul>
            </div>
        </>
    )
}

export default IndexList
