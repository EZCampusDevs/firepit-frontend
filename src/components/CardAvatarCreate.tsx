import * as React from "react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Toggle } from "@/components/ui/toggle"

import { newRoom } from "../core/requests" //TODO: remove and put into landing pg

interface CardAvatarCreateProps {
  onAction: (value: any) => void; // Define the type of your callback function
  requiredOccupation: boolean;
}

export function CardAvatarCreate({ onAction, requiredOccupation }: CardAvatarCreateProps) {

  //* ------------------- Generic React State ------------------------

  const [selectedAvatar, setSelectedAvatar] = React.useState(-1);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onAction(newValue);
    return
  };

  const avatarImgs = [
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png",
  ];

  return (
    <Card className="w-[600px]">
      <CardContent>
        <br></br>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name:</Label>
            <Input id="name" placeholder="Enter nickname" onChange={handleInputChange} />
          </div>
          
        {requiredOccupation &&
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">Department:</Label>
            <Select>
              <SelectTrigger id="framework">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="f">Finance</SelectItem>
                <SelectItem value="it">IT & Support</SelectItem>
                <SelectItem value="sd">Software Development</SelectItem>
                <SelectItem value="do">Dev. Ops</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }


        <Label htmlFor="framework">Avatar:</Label>
        <div className="flex flex-col space-y-1.5">
          
{/* Avatars container */}
<div className="grid grid-cols-6 gap-4">

    {avatarImgs.map((avatarSrc, index) => (
        <Toggle
            aria-label="Set Avatar Icon"
            className="pt-2"
            key={index}
            toggled={selectedAvatar === index}
            onClick={() => {
              if(selectedAvatar == index) {
                setSelectedAvatar(-1);
              } else {
                setSelectedAvatar(index);
              }
            }}
        >
            <Avatar>
                <AvatarImage src={avatarSrc} alt={`avatar icon`} />
                <AvatarFallback>{`${index}`}</AvatarFallback>
            </Avatar>
        </Toggle>
    ))}
</div>

          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">

        {/* TODO: Make the clear btn. actually clear the whole form */}

        <Button variant="outline" onClick={() => setSelectedAvatar(-1)}>Clear</Button>
        <Button onClick={() => {newRoom("room_a",50)}}>Join Room</Button>
      </CardFooter>
    </Card>
  );

}
