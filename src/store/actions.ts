import {AppThunk} from './store'
import {
    getCurrentSong, selectMusic, PLAY_MODE,
    setCurrentIndex, setFullScreen, setPlayingState,
    setPlayList, setPlayMode, setSequenceList
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


export const changeMode = (mode: PLAY_MODE): AppThunk => (
    dispatch,
    getState
) => {
    const {sequenceList} = selectMusic(getState())
    const currentSong = getCurrentSong(getState())
    switch (mode) {
        case PLAY_MODE.sequence:
            dispatch(setPlayList(sequenceList))
            break
        case PLAY_MODE.random:
            dispatch(setPlayList(shuffle(sequenceList)))
            break
        case PLAY_MODE.loop:
            dispatch(setPlayList(sequenceList))
    }
    // 获取最新的playList
    const {playList} = selectMusic(getState())
    const index = playList.findIndex(song => song.id === currentSong.id)
    dispatch(setCurrentIndex(index))
    dispatch(setPlayMode(mode))
}

//
// export const addSong = (song: Song): AppThunk => (
//     dispatch,
//     getState
// ) => {
//     const {playList, sequenceList} = selectMusic(getState())
//
// }
