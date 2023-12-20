import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    room : null,
    crowd: [],
    speaker: null
}

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {

            splice_one: (state,action) => {
                
                console.log(action.payload);
                console.log(state.participants);
                
            },

            setRoom: (state,action) => {
                
                //* 1. Set all Participants of Room
                state.room = action.payload.room;

                //* 2. Define the Crowd (Non-speakers) & Speaker himself
                for(const participant of state.room.room_members){
                    
                    if(participant.client_id !== state.room.room_speaker.client_id){
                        state.crowd.push(participant)
                    } else {
                        state.speaker = participant;
                    }

                }
                return;
            },

            appendParticipant: (state,action) => {

                const newcomer = action.payload.newcomer;
                let incomingUniqueMember = false;

                for(const participant of state.room.room_members) {
                    if(participant.client_id === newcomer.client_id){
                        incomingUniqueMember = true;
                        return;
                    }
                }

                if(!incomingUniqueMember) {
                    state.room.room_members.push(action.payload.newcomer);
                    state.crowd.push(action.payload.newcomer);
                }

                return;
            }
    }
})

export const { splice_one, setRoom, appendParticipant } = roomSlice.actions;

export default roomSlice.reducer;