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
import { LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY, HTTP_HOST } from "../core/Constants";
import { RoomNavbar } from "./RoomNavbar";

export function RoomPage() {
    const { roomCode } = useParams();

    const Room = useSelector((state: any) => state.room.room); //Entire Room JSON
    const Crowd = useSelector((state: any) => state.room.crowd); //Only the Crowd (Non-Speakers)
    const Speaker = useSelector((state: any) => state.room.speaker); //Only the Crowd (Non-Speakers)

    const dispatch = useDispatch();

    const [isSimpleView, setIsSimpleView] = React.useState(false);
    const [selfSpeaking, setSelfSpeaking] = React.useState(false); //* Am I (self) speaking right now?

    // Initialize cryptoUUID only once when the component mounts
    const [cryptoUUID] = React.useState(() => crypto.randomUUID());

    //* --- Simple View State Components ---
    const [simpleViewCrowd, setSimpleViewCrowd] = React.useState<React.ReactNode[]>([]);

    // Function to handle switch toggle
    const handleSwitchChange = () => {
        setIsSimpleView(!isSimpleView);
    };



    const wsCallback = (wsResponse: any) => {

        //* WHO AM I MESSAGE | Let's the client know who they are.
        if (wsResponse.messageType === 100) {

            const REQ_SELF_STR = window.localStorage.getItem(LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY);
            window.localStorage.removeItem(LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY);
            

            const TabID = {
                room_query: REQ_SELF_STR, 
                payload: wsResponse.payload,
                active: true
            }

            //Add Tab ID to LS
            window.localStorage.setItem(cryptoUUID, JSON.stringify(TabID));


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

    function leaveTheRoom() {
        window.localStorage.removeItem(cryptoUUID);
        window.location.href = "/";
    }


    //* ------ useEffect on Mount for WS Connection & Self Identification -----

    React.useEffect(() => {
        

        const REQ_SELF_STR = window.localStorage.getItem(LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY);

        if (REQ_SELF_STR) {
            //* Use of Singleton instance, ensure's a global & singular instance of class
            const wsManager = WebSocketSingleton.getInstance();
            wsManager.connect(REQ_SELF_STR, wsCallback);


        }  else { //**** Reconnection Assertion in ELSE STMT */    


            const wsManager = WebSocketSingleton.getInstance();


            // Object.keys(window.localStorage).forEach((key) => {
                
                
            //     if (key.length <= 25) {
            //         return; // Skip this key and move to the next one
            //     }

            //     let item;

            //     try {
            //         item = JSON.parse(window.localStorage.getItem(key));
            //     } catch (error) {
            //         console.error(`Error parsing localStorage item with key "${key}":`, error);
            //         return; // If parsing fails, skip this iteration
            //     }

            //     console.log(item);

            //     const QUERY_STR = item.room_query; // Example query string
            //     const match = QUERY_STR.match(/[\?&]rid=([^&#]*)/); // Use regex to find 'rid' value
            //     const extractedRoomCode = match ? match[1] : null; // Extract 'rid' value or null if not found
    
            //     console.log(extractedRoomCode); // Room Code
            
            //     // Proceed with items that successfully parsed as JSON
            //     // if (item && extractedRoomCode && extractedRoomCode === roomCode) {
            //     //     console.log("Found a matching inactive item with room code:", roomCode);
                    
            //     //     const RECON_STR = QUERY_STR+"&rtoken="+item.payload.reconnection_token;

            //     //     //* Use of Singleton instance, ensure's a global & singular instance of class
            //     //     const wsManager = WebSocketSingleton.getInstance();
            //     //     wsManager.connect(RECON_STR, wsCallback);

            //     //     window.localStorage.removeItem(key);

            //     // }
            // });
            
        }

        const markUserInactive_B4_UNLOAD = (e: any) => {

            const wsManager = WebSocketSingleton.getInstance();
            
            const tabObjStr = window.localStorage.getItem(cryptoUUID);
            if (tabObjStr) {
                try {
                    const tabObject = JSON.parse(tabObjStr);
                    tabObject.active = false; // Mark as inactive
                    window.localStorage.setItem(cryptoUUID, JSON.stringify(tabObject)); // Update localStorage
                } catch (error) {
                    console.error("Error updating localStorage item on tab close:", error);
                }
            }
            wsManager.disconnect();
            // Note: Direct interactions like `e.preventDefault()` will not work in modern browsers for `beforeunload`.
        };

        window.addEventListener('beforeunload', markUserInactive_B4_UNLOAD);

        return () => {
            window.removeEventListener('beforeunload', markUserInactive_B4_UNLOAD);
        }

    }, []);

    //* ----------- useEffect for UPDATING SPEAKER STATE ----------

    React.useEffect(() => {

        if (!Speaker) {
            return;
        }

        const tabObjStr = window.localStorage.getItem(cryptoUUID);

        if (!tabObjStr) { 
            console.log(`[debug] Couldn't find LS item... TSTR: ${tabObjStr} , CID: ${cryptoUUID}`);

            setSelfSpeaking(false);
            return;
        }

        const tabObject = JSON.parse(tabObjStr);

        const thisClient = tabObject.payload.client; 
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

            <div>
                <Button className="ml-2" onClick={ leaveTheRoom }>
                    Leave Room
                </Button>
            </div>

            <div className="flex flex-col justify-center items-center w-full" 
                 style={{ 
                    // TODO: make this test.jpg dynamic based on the theme
                    backgroundImage: `url(${HTTP_HOST}/static/test.jpg)`,
                    height: "100vh"
                 }
                 }>

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
