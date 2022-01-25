import React from 'react'
import styles from './Loading.module.css'

const Loading = React.memo(({title = '正在载入...'}: { title?: string }) => {
    return <div className={styles.loading}>
        <div className={styles.loadingContent}>
            <div className={styles.container}>
                <div className={`${styles.one} ${styles.common}`}/>
                <div className={`${styles.two} ${styles.common}`}/>
                <div className={`${styles.three} ${styles.common}`}/>
                <div className={`${styles.four} ${styles.common}`}/>
                <div className={`${styles.five} ${styles.common}`}/>
                <div className={`${styles.six} ${styles.common}`}/>
                <div className={`${styles.seven} ${styles.common}`}/>
                <div className={`${styles.eight} ${styles.common}`}/>
            </div>
            <p className={styles.desc}>{title}</p>
        </div>
    </div>
})

export default Loading
