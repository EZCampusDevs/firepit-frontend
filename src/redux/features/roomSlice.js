import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    room: null,
    speaker: null,
}

function sortClients(state) {
    if (state.room) state.room.room_members.sort((a, b) => b.order - a.order)
}

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state, action) => {
            state.room = action.payload.room
            state.speaker = action.payload.room.room_speaker

            sortClients(state)

            return
        },

        setSpeaker: (state, action) => {
            if (!state.room) {
                return
            }

            const speaker_id = action.payload.speaker_id

            for (const participant of state.room.room_members) {
                if (participant.client_id === speaker_id) {
                    state.speaker = participant
                    return
                }
            }

            return
        },

        appendParticipant: (state, action) => {
            if (!state.room) {
                return
            }

            const newcomer = action.payload.newcomer

            for (const participant of state.room.room_members) {
                if (participant.client_id === newcomer.client_id) {
                    return
                }
            }

            state.room.room_members.push(action.payload.newcomer)
            sortClients(state)
            return
        },

        removeParticipant: (state, action) => {
            if (!state.room) {
                return
            }

            const departer = action.payload.departer

            // Remove the departer from the room members
            state.room.room_members = state.room.room_members.filter(
                (participant) => participant.client_id !== departer.client_id
            )

            sortClients(state)
            return
        },
    },
})

export const { setRoom, setSpeaker, appendParticipant, removeParticipant } =
    roomSlice.actions

export default roomSlice.reducer
