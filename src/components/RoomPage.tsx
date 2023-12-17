import React from "react";

import { CrowdCard } from "./CrowdCard";
import { SpeakerCard } from "./SpeakerCard";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ComplexRoomView } from "./room_views/ComplexRoomView";

export function RoomPage() {

    const [isSimpleView, setIsSimpleView] = React.useState(false);

    // Function to handle switch toggle
    const handleSwitchChange = () => {
        setIsSimpleView(!isSimpleView);
    };

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
                isSimpleView ? <ComplexRoomView/> :             
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full px-4">
                {/* Placeholder cards */}
                <CrowdCard />
                <CrowdCard />
                <CrowdCard />
                <CrowdCard />
                <CrowdCard />

                {/* Add more placeholder cards as needed */}
            </div>

            }
            </div>


        </div>
    );
}
