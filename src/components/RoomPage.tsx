import React from "react";
import { useLocation } from 'react-router-dom';

import { CrowdCard } from "./CrowdCard";
import { SpeakerCard } from "./SpeakerCard";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ComplexRoomView } from "./room_views/ComplexRoomView";
import { SimpleRoomView } from "./room_views/SimpleRoomView";

//* API & WS Imports
import {socketConnect} from "../core/requests"

export function RoomPage() {

    const [isSimpleView, setIsSimpleView] = React.useState(false);

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

    React.useEffect(() => {
        socketConnect(rawQueryString);
      }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full">

            <h1 className="mt-16 mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl sm:text-lg">
                It's your turn to speak !
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
                <ComplexRoomView isCallerSpeaking={false}/> :
                <SimpleRoomView isCallerSpeaking={false}/>             
                

            }
            </div>


        </div>
    );
}
