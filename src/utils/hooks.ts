import React, {useEffect, useMemo, useRef} from 'react'
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
        fn?.()
        return {
            [style]: playList.length ? '.6rem' : '0'
        } as React.CSSProperties
    }, [playList, style])
}

/**
 * 挂载scroll组件———刷新
 * @param rely: 刷新组件依赖
 */
export const useLoadScroll = (rely: any) => {
    const scrollRef = useRef<any>(null)
    useEffect(() => {
        let timer: any
        if (scrollRef.current != null) {
            timer = setTimeout(() => {
                refreshScroll()
            }, 0)
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
 * 等待一个渲染结束时间——可能有问题
 * @param timeout: 定时间时间
 */
export function nextTick (timeout = 0): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), timeout)
    })
}

