import {AppThunk} from './store'
import {
    PLAY_MODE, setCurrentIndex, setFullScreen,
    setPlayingState, setPlayList, setPlayMode,
    setSequenceList
} from './reducers'
import {Song} from '../pages/singer/singerDetail/SingerDetail'
import {shuffle} from '../utils/util'

export const selectPlay = ({list, index}: { list: Song[], index: number }): AppThunk => (
    dispatch
) => {
    dispatch(setPlayingState(true))
    dispatch(setSequenceList(list))
    dispatch(setPlayList(list))
    dispatch(setFullScreen(true))
    dispatch(setPlayMode(PLAY_MODE.sequence))
    dispatch(setCurrentIndex(index))
}

export const randomPlay = (list: Song[]): AppThunk => (
    dispatch
) => {
    dispatch(setPlayingState(true))
    dispatch(setSequenceList(list))
    dispatch(setPlayList(shuffle(list)))
    dispatch(setFullScreen(true))
    dispatch(setPlayMode(PLAY_MODE.random))
    dispatch(setCurrentIndex(0))
}
