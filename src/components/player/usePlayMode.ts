// 播放模式
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {PLAY_MODE, selectMusic} from '../../store/reducers'
import React, {useMemo} from 'react'
import {changeMode} from '../../store/actions'

const usePlayMode = () => {
    const {playMode} = useAppSelector(selectMusic)
    const dispatch = useAppDispatch()
    // 播放模式下的icon样式
    const modeIcon = useMemo(() => {
        return playMode === PLAY_MODE.sequence
            ? 'icon-sequence' : playMode === PLAY_MODE.random
                ? 'icon-random' : 'icon-loop'
    }, [playMode])

    const modeText = useMemo(() => {
        return playMode === PLAY_MODE.sequence
            ? '顺序播放' : playMode === PLAY_MODE.random
                ? '随机播放' : '循环播放'
    }, [playMode])

    // 切换播放模式
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
