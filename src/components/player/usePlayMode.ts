import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {PLAY_MODE, selectMusic} from '../../store/reducers'
import React, {useMemo} from 'react'
import {changeMode} from '../../store/actions'

/**
 * 自定义hooks
 * 播放模式相关
 */
const usePlayMode = () => {
    const {playMode} = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()

    /**
     * 计算对应播放模式下的icon样式
      */
    const modeIcon = useMemo(() => {
        return playMode === PLAY_MODE.sequence
            ? 'icon-sequence' : playMode === PLAY_MODE.random
                ? 'icon-random' : 'icon-loop'
    }, [playMode])

    /**
     * 计算对应播放模式下的文字
     */
    const modeText = useMemo(() => {
        return playMode === PLAY_MODE.sequence
            ? '顺序播放' : playMode === PLAY_MODE.random
                ? '随机播放' : '循环播放'
    }, [playMode])

    /**
     * 切换播放模式
     * @param e
     */
    function togglePlayMode (e: React.MouseEvent) {
        const mode = (playMode + 1) % 3
        dispatch(changeMode(mode))
        e.stopPropagation()
    }

    return {
        modeIcon, togglePlayMode,
        modeText
    }
}

export default usePlayMode
