import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    room : null,
    crowd: [],
    speaker: null
}

const rebuildRoomContext = (state, speakerUUID) => {

    //* Clear Crowd & Speaker for fresh rebuild:
    state.crowd = []; state.speaker = null;

    //* 2. Define the Crowd (Non-speakers) & Speaker himself
    for(const participant of state.room.room_members){
                    
        if(participant.client_id !== speakerUUID){
            state.crowd.push(participant)
        } else {
            state.speaker = participant;
        }

    }

}

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        
            setRoom: (state,action) => {
                
                //* 1. Set all Participants of Room
                state.room = action.payload.room;
                
                //* 2. Build room context
                rebuildRoomContext(state, state.room.room_speaker.client_id);
                return;
            },

            setSpeaker: (state,action) => {
                rebuildRoomContext(state, action.payload.speaker_uuid);
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

                //* Making sure Newcomer isn't already listed within the Room Members (Bug #2 quickfix)
                if(!incomingUniqueMember) {
                    state.room.room_members.push(action.payload.newcomer);
                    state.crowd.push(action.payload.newcomer);
                }
                return;
            },

            removeParticipant: (state, action) => {
                const departer = action.payload.departer;
            
                // Remove the departer from the room members
                state.room.room_members = state.room.room_members.filter(participant => participant.client_id !== departer.client_id);
                // Remove the departer from the crowd
                state.crowd = state.crowd.filter(participant => participant.client_id !== departer.client_id);
            }
            
    }
})

export const { setRoom, setSpeaker, appendParticipant, removeParticipant } = roomSlice.actions;

export default roomSlice.reducer;