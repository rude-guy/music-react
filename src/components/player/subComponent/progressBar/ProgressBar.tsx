import React, {useCallback, useRef, useState} from 'react'
import styles from './ProgressBar.module.css'

interface Props {
    progress: number
    onProgressChanging?: (process: number) => any
    onProgressChanged?: (process: number) => any
}

const progressBtnWidth = 16

const touch = {
    x1: 0,
    beginWidth: 0
}

const ProgressBar: React.FC<Props> = ({progress, onProgressChanging, onProgressChanged}) => {
    const [offset, setOffset] = useState(0)
    const [barWidth, setBarWidth] = useState(0)
    const [rectLeft, setRectLeft] = useState(0)
    // 整个容器ref
    const container = useCallback(node => {
        if (node !== null) {
            const barWidth = node.clientWidth - progressBtnWidth
            setRectLeft(node.getBoundingClientRect().left)
            setBarWidth(barWidth)
            setOffset(barWidth * progress / 100)
        }
    }, [progress])

    // 进度条ref
    const progressRef = useRef<HTMLDivElement>(null)

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touch.x1 = e.touches[0].pageX
        touch.beginWidth = progressRef.current?.clientWidth || 0
    }, [])

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        const delta = e.touches[0].pageX - touch.x1
        const tempWidth = touch.beginWidth + delta
        const progress = Math.min(1, Math.max(0, tempWidth / barWidth))
        setOffset(progress * barWidth / 100)
        onProgressChanging?.(progress)
    }, [barWidth, onProgressChanging])

    const onTouchEnd = useCallback(() => {
        const processWidth = progressRef.current?.clientWidth || 0
        const progress = processWidth / barWidth
        onProgressChanged?.(progress)
    }, [barWidth, onProgressChanged])

    const onclick = useCallback((e: React.MouseEvent) => {
        const offsetWidth = e.pageX - rectLeft
        const progress = offsetWidth / barWidth
        onProgressChanged?.(progress)
    }, [rectLeft, barWidth, onProgressChanged])

    return <div className={styles.progressBar}
                ref={container}
                onClick={onclick}
    >
        <div className={styles.barInner}>
            <div className={styles.progress}
                 ref={progressRef}
                 style={{width: `${offset}rem`}}
            />
            <div className={styles.progressBtnWrapper}
                 style={{transform: `translate3d(${offset}rem, 0, 0)`}}
                 onTouchStartCapture={onTouchStart}
                 onTouchMoveCapture={onTouchMove}
                 onTouchEndCapture={onTouchEnd}
            >
                <div className={styles.progressBtn}/>
            </div>
        </div>
    </div>
}

export default ProgressBar
