import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { CardAvatarCreate } from "../CardAvatarCreate"

export function JoinRoom() {
  //* ------ Join Room State(s) & Constants ------

  const [roomCodeInput, setRoomCodeInput] = React.useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setCallback : any) => {
    const newValue = event.target.value;
    setCallback(newValue);
  };

    return (
        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>Room Access Code</CardTitle>
              <div></div>
              <Input type="text" placeholder="e.g., A1B2C3" 
              onChange={(event) => {handleInputChange(event, setRoomCodeInput)}} 
              sizeStyle={"h-12"} />
            </CardHeader>
            <hr />
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>Select a unique nickname and choose your avatar.</CardDescription>
            </CardHeader>

              
            <div className="flex justify-center mb-4">
              <CardAvatarCreate onAction={(value) => {
                console.log(value)
              }} requiredOccupation={true} />
            </div>

          </Card>
        </TabsContent>
    );
}
