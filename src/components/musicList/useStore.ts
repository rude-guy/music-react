// 派发store
import {Song} from '../../pages/singer/singerDetail/SingerDetail'
import {useAppDispatch} from '../../store/hooks'
import {useCallback} from 'react'
import {randomPlay, selectPlay} from '../../store/actions'

export const useStore = ({songs}: { songs: Song[] }) => {
    const dispatch = useAppDispatch()
    // 选择歌曲
    const onSelectItem = useCallback((song: Song, index: number) => {
        dispatch(selectPlay({list: songs, index}))
    }, [dispatch, songs])

    // 随机播放
    const onRandomPlaying = useCallback(() => {
        dispatch(randomPlay(songs))
    }, [dispatch, songs])

    return {
        onSelectItem,
        onRandomPlaying,
    }
}
