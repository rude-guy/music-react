import React from 'react'
import styles from './Loading.module.css'
import loading from './loading.gif'

const Loading = ({title}: { title: string }) => {
    return <div className={styles.loading}>
        <div className={styles.loadingContent}>
            <img width={"24"} height={"24"} src={loading} alt={'loading'}/>
            <p className={styles.desc}>{title}</p>
        </div>
    </div>
}

Loading.defaultProps = {
    title: '正在载入...'
}

export default Loading
