import {useAppSelector} from '../../../../store/hooks'
import {getCurrentSong, selectMusic} from '../../../../store/reducers'
import React, {useContext, useEffect, useRef, useState} from 'react'
import {MiniContext} from '../miniPlayer/MiniPlayer'

/**
 * 自定义hooks
 * 组件的显示隐藏
 */
export const useVisible = () => {
    const {sequenceList, playList} = useAppSelector(selectMusic)
    const currentSong = useAppSelector(getCurrentSong)
    const [visible, setVisible] = useState(false)
    const playListRef = useRef<any>(null)
    const {open, closePlayList} = useContext(MiniContext)

    /**
     * 关闭 PlayList组件
     * @param e
     */
    function closeVisible (e?: React.MouseEvent) {
        closePlayList()
        setVisible(false)
        e?.stopPropagation()
    }

    /**
     * Scroll重新计算高度
     */
    function refreshScroll () {
        playListRef.current.refresh()
    }

    /**
     * 滚动到对应元素DOM
     * @param node
     */
    function scrollToElement (node: HTMLElement) {
        playListRef.current?.scrollToElement(node)
    }

    /**
     * 打开自动滚动到对应的播放歌曲的位置
     */
    function autoScrollTop () {
        const index = playList.findIndex(item => currentSong.id === item.id)
        const node = playListRef.current.getChildren()[0].children[index]
        if (node instanceof HTMLElement) {
            setTimeout(() => {
                scrollToElement(node)
            }, 200)
        }
    }

    /**
     * 打开播放器触发动画
     */
    useEffect(() => {
        if (open) {
            setVisible(Boolean(playList.length))
        }
        let timer: any
        if (open && playListRef.current != null) {
            // 等待一个nextTick
            timer = setTimeout(() => {
                refreshScroll()
                autoScrollTop()
            }, 0)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [open, sequenceList])

    return {
        closeVisible, visible, playListRef,
        refreshScroll, scrollToElement
    }
}
