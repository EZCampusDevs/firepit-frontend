import { configureStore } from '@reduxjs/toolkit'

//Reducers
import roomReducer from './features/roomSlice.js'

export const store = configureStore({
    reducer: {
        room: roomReducer,
    },
})
