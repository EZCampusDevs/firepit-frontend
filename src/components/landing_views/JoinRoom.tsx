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

import { roomStringEncodeAndAccess } from "../../core/requests"

export function JoinRoom() {
  //* ------ Join Room State(s) & Constants ------

  const roomCodeInput = React.useRef('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setCallback: any) => {
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
            ref={roomCodeInput}
            sizeStyle={"h-12"} />
        </CardHeader>
        <hr />
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>Select a unique nickname and choose your avatar.</CardDescription>
        </CardHeader>


        <div className="flex justify-center mb-4">
          <CardAvatarCreate
            onAction={(value) => {

              if (value[0] === true) { //* Successful Avatar Creation

                const avatarPayload = value[1];  //?  {nickname, avatar, department}
                
                const URL_ENCODED_AVATAR_REQ = roomStringEncodeAndAccess(roomCodeInput.current.value, avatarPayload.nickname, avatarPayload.department, avatarPayload.avatar );
                window.localStorage.setItem("requested_self", URL_ENCODED_AVATAR_REQ);
                window.location.href = "/room/"+String(roomCodeInput.current.value);
                
              } else { //! Erroneous Message
                const errorMessage = value[1];
                //TODO: update state with this
              }

            }}
            requiredOccupation={true} />
        </div>

      </Card>
    </TabsContent>
  );
}
