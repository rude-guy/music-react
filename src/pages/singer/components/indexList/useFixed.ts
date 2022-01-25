import React, {useCallback, useEffect, useRef, useState} from 'react'
import {SingerData} from '../../Singer'

const TITLE_HEIGHT = 28
let TAB_TOP = 88

interface Props {
    singers: SingerData[]
}

export type ScrollTo = (anchorIndex: number, isMove?: boolean) => void

const useFixed = function ({singers}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const groupRef = useRef<HTMLUListElement>(null)
    const [currenIndex, setCurrentIndex] = useState<number>()   // 当前第几个标题
    const [fixedTitle, setFixedTitle] = useState('')   // 标题内容
    const [listHeights, setListHeights] = useState<number[]>([]) // 高度区间列表
    const [fixedStyle, setFixedStyle] = useState<React.CSSProperties>()   // 标题样式——推动效果
    const [scrollY, setScrollY] = useState<number>(0)  // 滚动距离
    const [distance, setDistance] = useState<number>(0)  // 标题距离

    /**
     * 窃听滚动事件
     */
    useEffect(() => {
        const scrollDom = scrollRef.current
        if (scrollDom) {
            TAB_TOP = scrollDom.getBoundingClientRect().top
            scrollDom.addEventListener('scroll', (e) => {
                // console.log(groupRef.current?.getBoundingClientRect())
                if (groupRef.current) {
                    const scrollY = TAB_TOP - groupRef.current.getBoundingClientRect().y
                    setScrollY(scrollY)
                    e.preventDefault()
                }
            })
        }
        return () => {
            scrollDom?.removeEventListener('scroll', () => {
            })
        }
    }, [])

    /**
     * 计算高度且设置fixedTitle
     */
    useEffect(() => {
        if (scrollY >= 0) {
            setFixedTitle(singers[currenIndex || 0]?.title || '')
        }
    }, [scrollY, singers, currenIndex])

    /**
     * 在0~TITLE_HEIGHT之间实现标题向上推动
     */
    useEffect(() => {
        const diff = (distance > 0 && distance < TITLE_HEIGHT) ?
            distance - TITLE_HEIGHT : 0
        setFixedStyle({
            transform: `translate3d(0, ${diff / 100}rem, 0)`
        })
    }, [distance])

    /**
     * 设置currentIndex
     */
    useEffect(() => {
        for (let i = 0; i < listHeights.length - 1; i++) {
            const heightTop = listHeights[i]
            const heightBottom = listHeights[i + 1]
            if (scrollY >= heightTop && scrollY <= heightBottom) {
                setCurrentIndex(i)
                setDistance(heightBottom - scrollY)
            }
        }
    }, [scrollY, listHeights])

    /**
     * 计算高度区间
     */
    const calculate = useCallback(() => {
        const list: HTMLCollection = (groupRef.current as HTMLUListElement).children
        let height = 0
        let heights: number[] | null = [0]
        for (let i = 0; i < list.length; i++) {
            height += list[i].clientHeight
            heights.push(height)
        }
        setListHeights(heights)
        heights = null
    }, [singers])

    /**
     * 列表变化重新计算
     */
    useEffect(() => {
        // 计算高度区间
        calculate()
    }, [calculate])

    /**
     * 滚动页面
     */
    const scrollTo: ScrollTo = useCallback((anchorIndex, isMove = false) => {
        if (Number.isNaN(anchorIndex)) {
            return
        }
        let y = listHeights[anchorIndex]
        if (isMove && y > listHeights[listHeights.length - 2]) {
            return
        }
        scrollRef.current?.scrollTo({
            top: y + 0.4,
            behavior: isMove ? 'auto' : 'smooth'
        })
    }, [listHeights])
    return {
        scrollRef, groupRef,
        fixedTitle, fixedStyle,
        currenIndex, scrollTo
    }
}

export default useFixed
