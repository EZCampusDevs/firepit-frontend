import React from "react";
import { useParams } from 'react-router-dom';

// UI Imports:
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Component Imports:
import { CrowdCard } from "./CrowdCard";
import { SpeakerCard } from "./SpeakerCard";
import { ComplexRoomView } from "./room_views/ComplexRoomView";
import { SimpleRoomView } from "./room_views/SimpleRoomView";

// Redux Imports : 
import { useSelector, useDispatch } from 'react-redux';
import {spliceOne, setRoom, appendParticipant} from '../redux/features/roomSlice';

// @ts-expect-error | Javascript API & WS Imports :
import { WebSocketSingleton } from "../core/WebSocketSingleton"
import { RoomNavbar } from "./RoomNavbar";

export function RoomPage() {
    const { roomCode } = useParams();

    const Room = useSelector((state : any) => state.room.room); //Entire Room JSON
    const Crowd = useSelector((state : any) => state.room.crowd); //Only the Crowd (Non-Speakers)
    const Speaker = useSelector((state : any) => state.room.speaker); //Only the Crowd (Non-Speakers)
    
    const dispatch = useDispatch();

    const [isSimpleView, setIsSimpleView] = React.useState(false);
    const [selfSpeaking, setSelfSpeaking] = React.useState(false); //* Am I (self) speaking right now?

    //* --- Simple View State Components ---
    const [simpleViewCrowd, setSimpleViewCrowd] = React.useState<React.ReactNode[]>([]);

    // Function to handle switch toggle
    const handleSwitchChange = () => {
        setIsSimpleView(!isSimpleView);
    };

    const wsCallback = (wsResponse : any) => {

        //* WHO AM I MESSAGE | Let's the client know who they are.
        if(wsResponse.messageType === 100){ 
            const selfJSON = wsResponse.client;
            window.localStorage.setItem("self", JSON.stringify(selfJSON));
            return 0;
        }

        //* ROOM PAYLOAD | JSON-ified; Java Room Class
        if(wsResponse.messageType === 60){ 
            const roomJSON = wsResponse.room;
            
            //Getting Self
            let selfJSON = window.localStorage.getItem("self");
            if(selfJSON) { selfJSON = JSON.parse(selfJSON); }
            else { return 1; } //! If it's Null, return error

            const SpeakerClientId = roomJSON.room_speaker.client_id;

            // @ts-expect-error | Check if Self is Speaking
            if(SpeakerClientId === selfJSON.client_id){
                setSelfSpeaking(true);
            } else {
                setSelfSpeaking(false);
            }
            
            
            dispatch(setRoom({
                room: roomJSON
            }));

        }

        //* PERSON JOINS ROOM | JSON-ified; Java Client Class
        if(wsResponse.messageType === 50){
            const newcomer = wsResponse.client;
            dispatch(appendParticipant({ newcomer }));
            return 0;
         }

        console.log("COMPONENT PRINT: ");
    }


    React.useEffect(() => {


        const REQ_SELF_STR = window.localStorage.getItem('requested_self');

        if(REQ_SELF_STR) {
            //* Use WS Singleton instance, ensure's a global & singular definition of the Instance
            const wsManager = WebSocketSingleton.getInstance();
            wsManager.connect(REQ_SELF_STR, wsCallback);

            localStorage.removeItem("requested_self");
        }

        //* Clear's URL Parameter state:
        window.history.replaceState(null, '', window.location.pathname);

      }, []);

    return (
        <>
        <RoomNavbar/>
        <div className="flex flex-col justify-center items-center w-full">
        
            <h1 className="mt-16 mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl sm:text-lg">
               { selfSpeaking ? "It's your turn to speak !" : "Mute & Listen to the speaker..."}
            </h1>

            <h2>
                {Room ? Room.room_code : ""}
            </h2>

            <br />
            <SpeakerCard />
            <br />

            <hr></hr>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full px-4">
                <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" onCheckedChange={handleSwitchChange}/>
                    <Label htmlFor="airplane-mode">
                        {
                            isSimpleView ? "Complex View" : "Simple View"
                        }
                        </Label>
                </div>
            </div>
            <br />

            <div className="max-w-6xl w-full px-4">
            {
                isSimpleView ? 
                <ComplexRoomView isCallerSpeaking={selfSpeaking}/> :
                <SimpleRoomView isCallerSpeaking={selfSpeaking}/>             
            }
            </div>


        </div>
        </>
    );
}
