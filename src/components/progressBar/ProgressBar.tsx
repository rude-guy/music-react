import React from 'react'
import styles from './ProgressBar.module.css'

const ProgressBar = () => {
    return <div className={styles.progressBar}>
        <div className={styles.barInner}>
            <div className={styles.progress} />
            <div className={styles.progressBtnWrapper}>
                <div className={styles.progressBtn} />
            </div>
        </div>
    </div>
}

export default ProgressBar
