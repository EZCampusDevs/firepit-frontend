//* --- REACT & UI IMPORTS ---
import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "./mode-toggle"

//* --- Component IMPORTS ---
import { JoinRoom } from "./landing_views/JoinRoom"
import { CreateRoom } from "./landing_views/CreateRoom"

import { getRngQuote } from "../core/requests"

import firepiturl from '../assets/firepit.gif';
import logurl     from '../assets/log.png';
import bgurl      from '../assets/bg.png';

export function TestPage() {

    const [quote, setQuote] = React.useState("Loading...");

    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);

    // const bg_url = "https://cdn.discordapp.com/attachments/1175552588792475758/1210323123942203452/test.jpg?ex=660f0e3f&is=65fc993f&hm=05c66ecbb10a2bd6594a9d279ceb6da0290594c5af0690a816bc00bec8074ce7";
    // const logurl = "http://localhost:8000/log.png";
    // const firepiturl =  require('./assets/firepit.gif').default;

    React.useEffect(() => {

        getRngQuote((fetchedQuote) => {
            setQuote(fetchedQuote); 
        });

        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []); 


    const MakeLog = (url, scale, rotation, width, height, x, y) => {

        // this makes top and left css adjust by the center of the element
        // this is important because it is unaware of the rotation
        const offsetTop  =  - height / 2;
        const offsetLeft =  - width / 2;

        return <img 
            src={url} 
            draggable={false}
            className="absolute select-none"
            style={{ 
                transformOrigin: "center center",
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                maxWidth: `${width}px`,
                maxHeight: `${height}px`,
                width: `${width}px`,
                height: `${height}px`,
                left: `${offsetLeft + x}px`, 
                top: `${offsetTop +y}px`  
            }}
        />
    }


    const MakeAllLogs = (w, h) => {

        const scale = 1;

        const sWidth = w;
        const sHeight = h;

        const iWidth  = 512 * scale;
        const iHeight = 128 * scale;

        const width  = iWidth /1.2;
        const height = iHeight /1.2;

        return <>

            { 
                // North 
                MakeLog(
                    logurl, 
                    scale, 
                    0,
                    width,
                    height,
                    sWidth / 2,
                    sHeight / 8,
                    ) 
            }

            { 
                // North West
                MakeLog(
                    logurl, 
                    scale, 
                    90 + 25,
                    width,
                    height,
                    sWidth / 7,
                    sHeight / 3,
                    ) 
            }

            { 
                // South West 
                MakeLog(
                    logurl, 
                    scale, 
                    90 - 35,
                    width,
                    height,
                    sWidth / 6,
                    sHeight - (sHeight / 4),
                    ) 
            }

            { 
                // South 
                MakeLog(
                    logurl, 
                    scale, 
                    0,
                    width,
                    height,
                    sWidth / 2,
                    sHeight - (sHeight / 15),
                    ) 
            }

            { 
                // South East 
                MakeLog(
                    logurl, 
                    scale, 
                    -45,
                    width * 0.8,
                    height,
                    sWidth - (sWidth / 6),
                    sHeight - (sHeight / 4),
                    ) 
            }
        </>
    };

    return (
        <div 
            className="flex flex-col justify-between items-center w-full h-screen" 
            style={{ 
                backgroundImage: `url(${bgurl})`, 
                backgroundSize: 'cover',
                backgroundColor: 'rgba(0,0,0,0.4)',
                backgroundBlendMode: 'darken',
                }}
            >

        <div className="flex items-center justify-center h-screen w-screen">
            <img className="select-none" src={firepiturl} draggable={false}></img>
        </div>

        {MakeAllLogs(width, height)}

    </div>
    )
}
