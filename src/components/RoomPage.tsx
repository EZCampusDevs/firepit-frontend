import React from "react";
import { useLocation } from 'react-router-dom';

import { CrowdCard } from "./CrowdCard";
import { SpeakerCard } from "./SpeakerCard";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ComplexRoomView } from "./room_views/ComplexRoomView";
import { SimpleRoomView } from "./room_views/SimpleRoomView";

//* API & WS Imports

// @ts-expect-error | Javascript Import
import { WebSocketSingleton } from "../core/WebSocketSingleton"

export function RoomPage() {

    const [isSimpleView, setIsSimpleView] = React.useState(false);
    const [selfSpeaking, setSelfSpeaking] = React.useState(false); //* Am I (self) speaking right now?

    //* --- Simple View State Components ---
    const [simpleViewCrowd, setSimpleViewCrowd] = React.useState<React.ReactNode[]>([]);

    //* --- URL Parameter & Decoding ---:
    const location = useLocation();
    const rawQueryString = location.search; // Capturing the raw query string

    const searchParams = new URLSearchParams(rawQueryString);
    const roomId = searchParams.get('rid');
    const displayName = searchParams.get('disp_name');
    const displayOccupation = searchParams.get('disp_occup');
    const avatarIndex = searchParams.get('disp_avatar');

    // Log the raw query string and the extracted parameters
    console.log(`Raw Query String: ${rawQueryString}`);
    console.log(`Extracted Parameters:
      - Room ID: ${roomId}
      - Display Name: ${displayName}
      - Display Occupation: ${displayOccupation}
      - Avatar Index: ${avatarIndex}`);

    //* ^^^ URL Parameter & Decoding ^^^:

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
            
            let simpleCrowdCards = [];
            //* --- Building CrowdCards (JSX Components to pass over to Simple View) ---
            for(const participant of roomJSON.room_members){

                if(participant.client_id != SpeakerClientId){ //Therefore they are part of the crowd
                    simpleCrowdCards.push( 
                    <CrowdCard 
                    displayName={participant.client_name}
                    displayOccupation={participant.client_occupation}
                    isCallerSpeaking={selfSpeaking} 
                    avatarIndex={1} />
                    );    
                }
            }
            setSimpleViewCrowd(simpleCrowdCards);

        }

        //* PERSON JOINS ROOM | JSON-ified; Java Client Class
        if(wsResponse.messageType === 40){
            const newcomer = wsResponse.client;

            // Create a new CrowdCard for the newcomer
            const newCrowdCard = (
                <CrowdCard
                    displayName={newcomer.client_name}
                    displayOccupation={newcomer.client_occupation}
                    isCallerSpeaking={selfSpeaking} // assuming selfSpeaking is defined in your scope
                    avatarIndex={1} // or any other appropriate value
                />
            );
        
            // Create a new array with all existing cards plus the new card
            const newSimpleViewCrowd = [...simpleViewCrowd, newCrowdCard];
        
            // Update the state
            setSimpleViewCrowd(newSimpleViewCrowd);
            return 0;
         }

        console.log("COMPONENT PRINT: ");
    }


    React.useEffect(() => {

        //* Use WS Singleton instance, ensure's a global & singular definition of the Instance
        const wsManager = WebSocketSingleton.getInstance();
        wsManager.connect(rawQueryString, wsCallback);

      }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full">

            <h1 className="mt-16 mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl sm:text-lg">
               { selfSpeaking ? "It's your turn to speak !" : "Mute & Listen to the speaker..."}
            </h1>

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
                <SimpleRoomView Crowd={simpleViewCrowd}/>             
            }
            </div>


        </div>
    );
}
