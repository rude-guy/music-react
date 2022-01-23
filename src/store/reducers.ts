import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from './store'
import {Song} from '../pages/singer/singerDetail/SingerDetail'
import {load} from '../assets/ts/arrayStroe'
import {SEARCH_KEY} from '../assets/ts/constant'

export enum PLAY_MODE {
    sequence = 0,  // 顺序
    loop = 1,    // 单曲循环
    random = 2   // 随机播放
}

export interface MusicState {
    sequenceList: Song[]   // 顺序播放列表
    playList: Song[]       // 播放列表
    playing: boolean  // 是否播放
    playMode: PLAY_MODE  // 播放的模式
    currentIndex: number  // 当前播放列表中歌曲的索引
    fullScreen: boolean  // 是否全屏播放
    favoriteList: Song[]   // 收藏歌曲播放列表
    searchHistory: string[]    // 搜索历史
    playHistory: Song[]   // 播放历史
}

const initialState: MusicState = {
    sequenceList: [],
    playList: [],
    playing: false,
    playMode: PLAY_MODE.sequence,
    currentIndex: 0,
    fullScreen: false,
    favoriteList: [],
    searchHistory: load(SEARCH_KEY),
    playHistory: []
}

export const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setPlayingState (state, action: PayloadAction<boolean>) {
            state.playing = action.payload
        },
        setSequenceList (state, action: PayloadAction<Song[]>) {
            state.sequenceList = action.payload
        },
        setPlayList (state, action: PayloadAction<Song[]>) {
            state.playList = action.payload
        },
        setPlayMode (state, action: PayloadAction<PLAY_MODE>) {
            state.playMode = action.payload
        },
        setFullScreen (state, action: PayloadAction<boolean>) {
            state.fullScreen = action.payload
        },
        setCurrentIndex (state, action: PayloadAction<number>) {
            state.currentIndex = action.payload
        },
        setFavoriteList (state, action: PayloadAction<Song[]>) {
            state.favoriteList = action.payload
        },
        addSongLyric (state, action: PayloadAction<{ song: Song, lyric: string }>) {
            const {song, lyric} = action.payload
            state.playList.map(item => {
                if (item.mid === song.mid) {
                    item.lyric = lyric
                }
                return item
            })
        },
        setSearchHistory (state, action: PayloadAction<[]>) {
            state.searchHistory = action.payload
        },
        setPlayHistory (state, action: PayloadAction<[]>) {
            state.playHistory = action.payload
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(incrementAsync.pending, (state) => {
    //         })
    //         .addCase(incrementAsync.fulfilled, (state, action) => {
    //         });
    // },
})

export const {
    setPlayingState, setSequenceList, setPlayList,
    setPlayMode, setFullScreen, setCurrentIndex,
    setFavoriteList, addSongLyric, setSearchHistory,
    setPlayHistory
} = musicSlice.actions

/*
 *  Getter
 */
// 根状态
export const selectMusic = ({music}: RootState) => music
// 当前播放歌曲
export const getCurrentSong = ({music}: RootState) => music.playList[music.currentIndex] || {}

export default musicSlice.reducer
