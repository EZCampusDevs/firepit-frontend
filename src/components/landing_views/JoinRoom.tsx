import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AlertTriangle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"


import { Input } from "@/components/ui/input"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CardAvatarCreate } from "../CardAvatarCreate"

import { roomStringEncodeAndAccess } from "../../core/requests"
import { LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY } from "../../core/Constants"
import { assertJoinRoom } from "../../core/assert"
 
import { ErrorAlert } from "../ErrorAlert"


export function JoinRoom() {
  //* ------ Join Room State(s) & Constants ------
  
  const [errMsg, setErrMsg] = React.useState("");

  const REQ_OCCUP = false;

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

              if (value[0] === true) { //* Signal for Join Room & Avatar crea:
                console.log("?");

                const nickname = value[1];  //?  {nickname, avatar, department}
                const avatar = value[2];
                const department = value[3];

                const roomCode = roomCodeInput.current.value;


                let assertTup = assertJoinRoom(nickname, avatar, department, REQ_OCCUP, roomCode)
                
                if(assertTup[0] === true) {

                  const URL_ENCODED_AVATAR_REQ = roomStringEncodeAndAccess(roomCode, nickname, department, avatar);

                  console.log("*** JOIN_ROOM_QUERY_KEY: "+URL_ENCODED_AVATAR_REQ);

                  window.localStorage.setItem(LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY, URL_ENCODED_AVATAR_REQ);
                  window.location.href = "/room/"+String(roomCode);
                  
                } else { //! Erroneous Message
                  const errorMessage = assertTup[1];
                  console.log("ERM: "+errorMessage);
                  setErrMsg(errorMessage);
                }

              }
            }}

            requireOccupation={REQ_OCCUP}
            />

        </div>

        <ErrorAlert error_msg={errMsg}/>


      </Card>

    </TabsContent>
  );
}
