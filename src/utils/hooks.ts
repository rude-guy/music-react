import React, {useEffect, useMemo, useRef} from 'react'
import {useAppSelector} from '../store/hooks'
import {selectMusic} from '../store/reducers'

export const useScrollStyle = (fn?: (...args: any) => any, style = 'bottom') => {
    const {playList} = useAppSelector(selectMusic)
    return useMemo(() => {
        fn?.()
        return {
            [style]: playList.length ? '.6rem' : '0'
        } as React.CSSProperties
    }, [playList, style])
}

// 挂载 scroll刷新
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
