import React from 'react'
import styles from './NoResult.module.css'


const NoResult = ({title}: {title: string}) => {
   return <div className={styles.noResult}>
       <div className={styles.noResultContent}>
           <div className={styles.icon} />
           <p className={styles.text}>{title}</p>
       </div>
   </div>
}

NoResult.defaultProps = {
    title: '抱歉，没有结果'
}

export default NoResult
