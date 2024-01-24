import React from "react";
import { useParams } from 'react-router-dom';

// UI Imports:
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"

// Component Imports:
import { CrowdCard } from "./CrowdCard";
import { SpeakerCard } from "./SpeakerCard";
import { ComplexRoomView } from "./room_views/ComplexRoomView";
import { SimpleRoomView } from "./room_views/SimpleRoomView";

// Redux Imports : 
import { useSelector, useDispatch } from 'react-redux';
import { setRoom, setSpeaker, appendParticipant, removeParticipant } from '../redux/features/roomSlice';

// @ts-expect-error | Javascript API & WS Imports :
import { WebSocketSingleton } from "../core/WebSocketSingleton";
import { LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY } from "../core/Constants";
import { RoomNavbar } from "./RoomNavbar";

export function RoomPage() {
    const { roomCode } = useParams();

    const Room = useSelector((state: any) => state.room.room); //Entire Room JSON
    const Crowd = useSelector((state: any) => state.room.crowd); //Only the Crowd (Non-Speakers)
    const Speaker = useSelector((state: any) => state.room.speaker); //Only the Crowd (Non-Speakers)

    const dispatch = useDispatch();

    const [isSimpleView, setIsSimpleView] = React.useState(false);
    const [selfSpeaking, setSelfSpeaking] = React.useState(false); //* Am I (self) speaking right now?

    //* --- Simple View State Components ---
    const [simpleViewCrowd, setSimpleViewCrowd] = React.useState<React.ReactNode[]>([]);

    // Function to handle switch toggle
    const handleSwitchChange = () => {
        setIsSimpleView(!isSimpleView);
    };



    const wsCallback = (wsResponse: any) => {

        //* WHO AM I MESSAGE | Let's the client know who they are.
        if (wsResponse.messageType === 100) {
            const selfJSON = wsResponse.payload.client;
            window.localStorage.setItem("self", JSON.stringify(selfJSON));
            return 0;
        }

        //* ROOM PAYLOAD | JSON-ified; Java Room Class
        if (wsResponse.messageType === 60) {
            const roomJSON = wsResponse.payload.room;
            dispatch(setRoom({ room: roomJSON }));
            return 0;
        }

        //* usr JOINS ROOM | JSON-ified; Java Client Class
        if (wsResponse.messageType === 50) {
            const newcomer = wsResponse.payload.client;
            dispatch(appendParticipant({ newcomer }));
            return 0;
        }

        //* usr LEAVES ROOM | JSON-ified; Java Client Class
        if (wsResponse.messageType === 40) {
            const departer = wsResponse.payload.client;
            dispatch(removeParticipant({ departer }));
            return 0;
        }

        //* ----- ACTUAL ACTIONS -----
        if (wsResponse.messageType === 30) {
            const speaker_uuid = wsResponse.payload.speaker_id;
            dispatch(setSpeaker({ speaker_uuid }));
            return 0;
        }

        console.log("COMPONENT PRINT: ");
        console.log(wsResponse);
    }

    //* ------ useEffect on Mount for WS Connection & Self Identification -----

    React.useEffect(() => {

        const REQ_SELF_STR = window.localStorage.getItem(LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY);

        if (REQ_SELF_STR) {
            //* Use of Singleton instance, ensure's a global & singular instance of class
            const wsManager = WebSocketSingleton.getInstance();
            wsManager.connect(REQ_SELF_STR, wsCallback);

            localStorage.removeItem(LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY);
        }


    }, []);

    //* ----------- useEffect for UPDATING SPEAKER STATE ----------

    React.useEffect(() => {

        if (!Speaker) {
            return;
        }

        let selfJSON = window.localStorage.getItem("self");

        if (!selfJSON) { 
            console.log("Could not find local storage item");
            setSelfSpeaking(false);
            return;
        }

        const thisClient = JSON.parse(selfJSON); 
        const SpeakerClientId = Speaker.client_id;

        console.log(`New speaker id = ${SpeakerClientId}, My ID = ${thisClient.client_id}`)

        if (SpeakerClientId === thisClient.client_id) {
            setSelfSpeaking(true);
        } else {
            setSelfSpeaking(false);
        }

    }, [Speaker]);


    //& -------- BUTTON COPY UI & FUNCTIONALITY -----

    const CLIPBOARD_SVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" className="lucide lucide-clipboard-list">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
    </svg>

    const CLIPBOARD_COPIED_SVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>

    const [copyButtonText, setCopyButtonText] = React.useState(CLIPBOARD_SVG);

    const copyToClipboard = () => {
        if (Room && Room.room_code) {
            navigator.clipboard.writeText(Room.room_code)
                .then(() => {
                    setCopyButtonText(CLIPBOARD_COPIED_SVG);
                    setTimeout(() => setCopyButtonText(CLIPBOARD_SVG), 2000); // Reset after 2 seconds
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full">

                <h1 className="mt-16 mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl sm:text-lg">
                    {selfSpeaking ? "It's your turn to speak !" : "Mute & Listen to the speaker..."}
                </h1>

                {/* ROOM TITLE & Sub-Heading Section*/}

                <div className="flex items-center">
                    <h1 className="text-lg md:text-xl dark:text-gray-400 text-darkgrey mt-2">

                        {Room ? <span className="mr-2">{Room.room_name}</span> : "Loading..."}

                        {/* ROOM CODE & COPY DISPLAY */}

                        <Button className="ml-2" onClick={() => { copyToClipboard() }}>
                            {Room ? <span className="mr-1">{Room.room_code}</span> : "Loading..."} {copyButtonText}
                        </Button>
                    </h1>

                </div>


                <br />
                <SpeakerCard />
                <br />

                <hr></hr>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full px-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" onCheckedChange={handleSwitchChange} />
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
                            <ComplexRoomView isCallerSpeaking={selfSpeaking} /> :
                            <SimpleRoomView isCallerSpeaking={selfSpeaking} />
                    }
                </div>


            </div>
        </>
    );
}
