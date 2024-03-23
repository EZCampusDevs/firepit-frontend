
import React from "react"

import { BellRing, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

// Redux Imports : 
import { useSelector, useDispatch } from 'react-redux';

type CardProps = React.ComponentProps<typeof Card>

export function SpeakerCard({ className, ...props }: CardProps) {

    const [isWideScreen, setIsWideScreen] = React.useState(window.innerWidth > 768); // Example breakpoint
    const [speakerCardContent, setSpeakerCardContent] = React.useState(<></>);

    const Speaker = useSelector((state : any) => state.room.speaker); //Only the Crowd (Non-Speakers)

    const speakerCardBuildJSX = () => {
        
        if(Speaker) {
            setSpeakerCardContent(
                <div>
                <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                    <Avatar>
                        <AvatarImage src={""} alt="avatar icon" />
                        <AvatarFallback>{`1`}</AvatarFallback>
                    </Avatar>

                    <div>
                        <CardTitle>{Speaker.client_name}</CardTitle>
                        <CardDescription>{Speaker.client_occupation}</CardDescription>
                    </div>
                </CardHeader>


                <CardFooter>
                    Has been speaking for 21 minutes now.
                </CardFooter>
            </div>
            );
        }
    }



    //* ------ Dynamic Resizing & OnMount Effect -----

    React.useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 768); // Update based on the same breakpoint
        };

        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //* ------ Dynamic Resizing & OnMount Effect -----
    React.useEffect(() => {
        speakerCardBuildJSX();
    }, [Speaker]);


    return (
        <Card className={"w-[300px]"} {...props}>

            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">

                {speakerCardContent}

                {isWideScreen && <div className="self-center sm:ml-0">
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z" />
                        <path d="m5 22 14-4" /><path d="m5 18 14 4" />
                    </svg>
                </div>}

            </div>
        </Card>
    )
}
