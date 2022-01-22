// 计算样式的
import React, {useCallback, useMemo, useRef} from 'react'
import {NumberOrString} from '../../types'

const RESERVED_HEIGHT = 40  // tab高度

export const useStyle = (scrollY: number, pic: string) => {
    const imageHeight = useRef(0) // 图片的高度
    const maxTranslateY = useRef(0) // 最大偏移高度

    // 初始化Image的高度
    const bgImage = useCallback((node: HTMLImageElement) => {
        if (node != null) {
            setTimeout(() => {
                imageHeight.current = node.clientHeight
                maxTranslateY.current = imageHeight.current - RESERVED_HEIGHT
            }, 0)
        }
    }, [])

    // 模糊背景样式
    const filterStyle = useMemo<React.CSSProperties>(() => {
        let blur = 0
        if (scrollY >= 0) {
            blur = Math.min(maxTranslateY.current / imageHeight.current, scrollY / imageHeight.current) * 0.5
        }
        return {
            backdropFilter: `blur(${blur}rem)`
        }
    }, [scrollY])

    // 背景图片样式
    const bgImageStyle = useMemo<React.CSSProperties>(() => {
        let zIndex = 0
        let paddingTop: NumberOrString = '70%'
        let height: NumberOrString = 0
        let translateZ = 0
        if (scrollY > maxTranslateY.current) {
            zIndex = 10
            paddingTop = 0
            height = RESERVED_HEIGHT / 100 + 'rem'
            translateZ = 1
        }
        let scale = 1
        if (scrollY < 0) {
            scale = 1 + Math.abs(scrollY / imageHeight.current)
        }
        return {
            height,
            paddingTop,
            translateZ,
            zIndex,
            backgroundImage: `url(${pic})`,
            transform: `scale(${scale})translateZ(${translateZ}px)`
        }
    }, [scrollY, pic])

    // 随机播放按钮
    const playBtnStyle = useMemo<React.CSSProperties>(() => {
        return {
            display: scrollY > maxTranslateY.current ? 'none' : ''
        }
    }, [scrollY])

    return {
        bgImage, bgImageStyle,
        filterStyle, playBtnStyle
    }
}
