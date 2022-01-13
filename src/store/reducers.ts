import {createSlice} from '@reduxjs/toolkit'

export interface MusicState {
    sequenceList: object
}

const initialState: MusicState = {
    sequenceList: {}
}

export const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {

    }
})

export default musicSlice.reducer
