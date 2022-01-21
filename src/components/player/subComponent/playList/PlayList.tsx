import React from 'react'
import styles from './PlayList.module.css'
import ReactDOM from 'react-dom'
import Scroll from '../../../scroll/Scroll'

const PlayList = () => {
    return (
        <div className={styles.playlist}>
            <div className={styles.listWrapper}>
                <div className={styles.listHeader}>
                    <h1 className={styles.title}>
                        <i className={`${styles.icon} icon-sequence`}/>
                        <span className={`${styles.text}  no-wrap`}>{'modeText'}</span>
                        <span className={'extend-click'}>
                            <i className={`icon-clear ${styles.iconClear}`}/>
                        </span>
                    </h1>
                </div>
                <Scroll className={styles.listContent}>
                    <ul>
                        <li className={styles.item}>
                            <i className={`${styles.current} icon-play`}/>
                            <span className={`${styles.text} no-wrap`}>{'name'}</span>
                            <span className={`${styles.favorite} extend-click`}>
                               <i className={'icon-not-favorite'}/>
                            </span>
                            <span className={styles.delete}>
                            <i className={'icon-delete'}/>
                        </span>
                        </li>
                    </ul>
                </Scroll>
                <div className={styles.listAdd}>
                    <div className={styles.add}>
                        <i className={`icon-add ${styles.iconAdd}`}/>
                        <span className={styles.text}>添加歌曲到队列</span>
                    </div>
                </div>
                <div className={styles.listFooter}>
                    <span>关闭</span>
                </div>
            </div>
        </div>
    )
}


export default () => {
    return ReactDOM.createPortal(<PlayList />, document.getElementsByTagName('body')[0])
}
