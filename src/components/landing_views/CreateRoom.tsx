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
  import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

import { newRoom } from "../../core/requests" //TODO: remove and put into landing pg

export function CreateRoom() {

    //* ------------ Create Room State & Constants ----------------
  const DEFAULT_ROOM_CAPACITY = 25;

  const roomName = React.useRef('');
  const [roomCapDisplay, setRoomCapDisplay] = React.useState(String(DEFAULT_ROOM_CAPACITY));
  const [occupationMandate, setOccupationMandate] = React.useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setCallback : any) => {
    const newValue = event.target.value;
    setCallback(newValue);
  };

  return (
    <TabsContent value="create">
      <Card>
        <CardHeader>
          <CardTitle>Name Your Room</CardTitle>
          <div></div>
          <Input type="text" 
          ref={roomName}
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
          <CardAvatarCreate 
          requiredOccupation={occupationMandate}
          onAction={(value) => {

            if(value[0] === true){ //* Successful Avatar Creation
              
              const avatarPayload = value[1];  //?  {nickname, avatar, department}
              newRoom(roomName.current.value, parseInt(roomCapDisplay), occupationMandate,
                    avatarPayload.nickname, avatarPayload.department, avatarPayload.avatar 
              );

            } else { //! Erroneous Message
              const errorMessage = value[1];
            }

          }}/>
        </div>
      </Card>
    </TabsContent>
  );
}
