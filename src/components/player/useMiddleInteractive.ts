import React, {useCallback, useRef, useState} from 'react'

type CurrentShow = 'cd' | 'lyric'
type Touch = {
    startX: number
    startY: number
    directionLocked: '' | 'h' | 'v'
    percent: number
}
// 屏幕宽度
const innerWidth = -window.innerWidth

/**
 * 自定义hooks
 * 播放器首页左右滑动相关
 */
export default function useMiddleInteractive () {
    const [currentShow, setCurrentShow] = useState<CurrentShow>('cd')
    const [middleLStyle, setMiddleLStyle] = useState<React.CSSProperties>()
    const [middleRStyle, setMiddleRStyle] = useState<React.CSSProperties>()

    const touch = useRef<Touch>({
        startX: 0,
        startY: 0,
        directionLocked: '', // 方向锁定
        percent: 0
    })
    const currentView = useRef<CurrentShow>('cd')

    /**
     * touch事件
     * 初始化x,y值和 directionLocked
     */
    const onMiddleTouchstart = useCallback((e: React.TouchEvent) => {
        touch.current.startX = e.touches[0].pageX
        touch.current.startY = e.touches[0].pageY
        touch.current.directionLocked = ''
    }, [])

    /**
     * move事件
     */
    const onMiddleTouchmove = useCallback((e: React.TouchEvent) => {
        const delaX = e.touches[0].pageX - touch.current.startX
        const delaY = e.touches[0].pageY - touch.current.startY

        const absDelaX = Math.abs(delaX)
        const absDelaY = Math.abs(delaY)

        // 移动x的距离大于y值时默认为 水平（h）滑动
        if (!touch.current.directionLocked) {
            touch.current.directionLocked = absDelaX >= absDelaY ? 'h' : 'v'
        }

        if (touch.current.directionLocked === 'v') {
            return
        }

        const left = currentView.current === 'cd' ? 0 : innerWidth
        const offsetWidth = Math.min(0, Math.max(left + delaX, innerWidth))
        touch.current.percent = Math.abs(offsetWidth / window.innerWidth)
        if (currentView.current === 'cd') {
            setCurrentShow(touch.current.percent > 0.2 ? 'lyric' : 'cd')
        } else {
            setCurrentShow(touch.current.percent < 0.8 ? 'cd' : 'lyric')
        }
        setMiddleLStyle({
            opacity: 1 - touch.current.percent
        })
        setMiddleRStyle({
            transform: `translate3d(${offsetWidth / 100}rem, 0, 0)`
        })
    }, [])

    /**
     * end事件
     * 滑动最终样式
     */
    const onMiddleTouchend = useCallback(() => {
        let offsetWidth
        let opacity
        if (currentShow === 'cd') {
            currentView.current = 'cd'
            offsetWidth = 0
            opacity = 1
        } else {
            currentView.current = 'lyric'
            offsetWidth = innerWidth
            opacity = 0
        }
        const duration = 300
        setMiddleLStyle({
            opacity,
            transitionDuration: `${duration}ms`
        })
        setMiddleRStyle({
            transform: `translate3d(${offsetWidth}px, 0, 0)`,
            transitionDuration: `${duration}ms`
        })
    }, [currentShow])

    return {
        onMiddleTouchstart, onMiddleTouchmove, onMiddleTouchend,
        currentShow, middleLStyle, middleRStyle
    }
}
