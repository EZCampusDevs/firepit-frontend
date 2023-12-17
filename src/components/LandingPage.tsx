import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CardAvatarCreate } from "./CardAvatarCreate"
import { ModeToggle } from "./mode-toggle"

import { Slider } from "@/components/ui/slider"
import { newRoom } from "../core/requests" //TODO: remove and put into landing pg

export function LandingPage() {

  const DEFAULT_ROOM_CAPACITY = 25;

  //* Join Room State(s) & Constants

  const [roomCodeInput, setRoomCodeInput] = React.useState('');

  //* ------------ Create Room State & Constants ----------------
  const [roomName, setRoomName] = React.useState('');
  const [roomCapDisplay, setRoomCapDisplay] = React.useState(String(DEFAULT_ROOM_CAPACITY));
  const [occupationMandate, setOccupationMandate] = React.useState(false);



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setCallback : any) => {
    const newValue = event.target.value;
    setCallback(newValue);
  };

  return (
    <div className="flex flex-col justify-between items-center w-full"> {/* Full screen container */}
      <h1 className="mt-16 mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl sm:text-lg">
        Welcome to Firepit <ModeToggle />
      </h1>
      <code>Version 0.0.1</code>
      <Tabs defaultValue="join" className="w-full md:w-[800px] max-w-[95%]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="join">Join A Room</TabsTrigger>
          <TabsTrigger value="create">Create The Room</TabsTrigger>
        </TabsList>

        {/* JOIN ROOM TAB MAIN UI */}

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
                console.log('hi')
              }} requiredOccupation={true} />
            </div>
          </Card>
        </TabsContent>

        {/* CREATE ROOM TAB MAIN UI */}


        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Name Your Room</CardTitle>
              <div></div>
              <Input type="text" 
              onChange={(event) => {handleInputChange(event, setRoomName)}} 
              placeholder="e.g., Firepit Marketting Strategy Session" sizeStyle={"h-12"} />
              <br />
              <CardTitle>Capacity Limit</CardTitle>
              <CardDescription>Set the maximum number of participants allowed | Currently set to: {roomCapDisplay} persons.</CardDescription>

              <Slider
                defaultValue={[DEFAULT_ROOM_CAPACITY]}
                max={100}
                step={1}
                onValueChange={(valueInt) => { setRoomCapDisplay(String(valueInt)) }}
              />
              <br/><br/>
              <div className="items-top flex space-x-2">
                <Checkbox id="terms1" onCheckedChange={(checked : any) => setOccupationMandate(checked)}/>
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mandate Declaration of Professional Role
                  </label>
                  <p className="text-sm text-muted-foreground">
                  This feature is highly recommended for organizations with specialized divisions, e.g., Finance, Accounting, IT. and Support, ensuring precise role identification.
                  </p>
                </div>
              </div>

            </CardHeader>
            <hr />
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>Select a unique nickname and choose your avatar.</CardDescription>
            </CardHeader>

            <div className="flex justify-center mb-4">
              <CardAvatarCreate onAction={(value) => {
                if(value == 200) {
                  newRoom(roomName, parseInt(roomCapDisplay), occupationMandate);
                }
              }} requiredOccupation={true}/>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
