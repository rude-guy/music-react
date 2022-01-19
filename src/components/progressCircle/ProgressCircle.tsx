import React from 'react'
import styles from './ProgressCircle.module.css'

const ProgressCircle: React.FC<{ radius: number }> = ({radius, children}) => {
    return <div className={styles.progressCircle}>
        <svg
            width={radius}
            height={radius}
            viewBox="0 0 100 100"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                className={styles.progressBackground}
                r="50"
                cx="50"
                cy="50"
                fill="transparent"
            />
            <circle
                className={styles.progressBar}
                r="50"
                cx="50"
                cy="50"
                fill="transparent"
                stroke-dasharray="dashArray"
                stroke-dashoffset="dashOffset"
            />
        </svg>
        {children}
    </div>
}


ProgressCircle.defaultProps = {
    radius: 100
}

export default ProgressCircle
