import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useAppSelector} from '../store/hooks'
import {selectMusic} from '../store/reducers'

/**
 * 存在playList（播放列表）时，预留miniPlay组件的位置
 * @param fn： 重新计算高度时的回调
 * @param style: 样式
 */
export const useScrollStyle = (fn?: (...args: any) => any, style = 'bottom') => {
    const {playList} = useAppSelector(selectMusic)
    return useMemo(() => {
        // 等一个nextTick
        setTimeout(() => {
            fn?.()
        }, 100)
        return {
            [style]: playList.length ? '.6rem' : '0'
        } as React.CSSProperties
    }, [playList, style])
}

/**
 * 挂载scroll组件———刷新
 * @param rely: 刷新组件依赖
 * @param timeout: 超时
 */
export const useLoadScroll = (rely: any, timeout = 0) => {
    const scrollRef = useRef<any>(null)
    useEffect(() => {
        let timer: any
        if (scrollRef.current != null) {
            timer = setTimeout(() => {
                refreshScroll()
            }, timeout)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [rely])

    function refreshScroll () {
        scrollRef.current?.refresh()
    }

    // 存在playList重新计算，mini播放器的位置
    const playListStyle = useScrollStyle(refreshScroll)

    return {
        scrollRef, refreshScroll, playListStyle
    }
}

/**
 * 自定义hooks
 * 简单CSSTranslation动画
 * @param init: 初始值
 */
export const useCSSTranslation = (init = true) => {
    // 动画相关
    const [visible, setVisible] = useState(init)

    function showVisible () {
        setVisible(true)
    }
    /**
     * 关闭动画
     */
    function closeVisible () {
        setVisible(false)
    }

    return {visible, closeVisible, showVisible}
}

/**
 * 等待一个渲染结束时间——可能有问题
 * @param timeout: 定时间时间
 */
export function nextTick (timeout = 0): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), timeout)
    })
}
