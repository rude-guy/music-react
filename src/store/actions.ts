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


export const removeSong = (song: Song): AppThunk => (
    dispatch,
    getState
) => {
    const {playList, sequenceList, currentIndex} = selectMusic(getState())

    const sequenceListSlice = sequenceList.slice()
    const playListSlice = playList.slice()

    const sequenceIndex = findIndex(sequenceListSlice, song)
    const playListIndex = findIndex(playListSlice, song)

    if (sequenceIndex < 0 || playListIndex < 0) return

    sequenceListSlice.splice(sequenceIndex, 1)
    playListSlice.splice(playListIndex, 1)

    if (playListIndex < currentIndex || playList.length === currentIndex) {
        dispatch(setCurrentIndex(currentIndex - 1))
    }
    dispatch(setPlayList(playListSlice))
    dispatch(setSequenceList(sequenceListSlice))
    if (!playList.length) {
        dispatch(setPlayingState(false))
    }
}

export const clearSongList = (): AppThunk => (
    dispatch,
) => {
    dispatch(setCurrentIndex(0))
    dispatch(setSequenceList([]))
    dispatch(setPlayList([]))
    dispatch(setPlayingState(false))
}

export const addSong = (song: Song): AppThunk => (
    dispatch,
    getState
) => {
    const {playList, sequenceList} = selectMusic(getState())
    const sequenceListSlice = sequenceList.slice()
    const playListSlice = playList.slice()
    let currentIndex: number
    const playIndex = findIndex(playListSlice, song)
    if (playIndex > -1) {
        currentIndex = playIndex
    } else {
        playListSlice.push(song)
        currentIndex = playListSlice.length - 1
    }

    const sequenceIndex = findIndex(playListSlice, song)
    if (sequenceIndex === -1) {
        sequenceListSlice.push(song)
    }

    dispatch(setCurrentIndex(currentIndex))
    dispatch(setSequenceList(sequenceListSlice))
    dispatch(setPlayList(playListSlice))
    dispatch(setPlayingState(true))
    dispatch(setFullScreen(true))
}


function findIndex<T extends Song> (list: T[], song: Song) {
    return list.findIndex(item => item.id === song.id)
}
