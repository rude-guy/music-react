import React from 'react'
import styles from './Loading.module.css'
import loading from './loading.gif'

const Loading = React.memo(({title = '正在载入...'}: { title?: string }) => {
    return <div className={styles.loading}>
        <div className={styles.loadingContent}>
            <img width={"24"} height={"24"} src={loading} alt={'loading'}/>
            <p className={styles.desc}>{title}</p>
        </div>
    </div>
})

export default Loading
