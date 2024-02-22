//* --- REACT & UI IMPORTS ---
import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "./mode-toggle"

//* --- Component IMPORTS ---
import { JoinRoom } from "./landing_views/JoinRoom"
import { CreateRoom } from "./landing_views/CreateRoom"

import { getRngQuote } from "../core/requests"

export function LandingPage() {

  const [quote, setQuote] = React.useState("Loading...");

  React.useEffect(() => { //* Get Random Quote for Firepit main page

    getRngQuote((fetchedQuote) => {
      setQuote(fetchedQuote); 
    });

  }, []); 

  return (
    <div className="flex flex-col justify-between items-center w-full"> {/* Full screen container */}
      <h1 className="mt-16 mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl sm:text-lg">
        Welcome to Firepit <ModeToggle />
      </h1>
      
      <code> {quote} </code>
      
      <Tabs defaultValue="join" className="w-full md:w-[800px] max-w-[95%]">

        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="join">Join A Room</TabsTrigger>
          <TabsTrigger value="create">Create The Room</TabsTrigger>
        </TabsList>

        {/* JOIN ROOM TAB MAIN UI */}
        <JoinRoom />

        {/* CREATE ROOM TAB MAIN UI */}
        <CreateRoom />

      </Tabs>
    </div>
  )

}
