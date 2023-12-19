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


interface CardAvatarCreateProps {
  onAction: (value: any) => void;
  requiredOccupation: boolean;
}

export function CardAvatarCreate({ onAction, requiredOccupation }: CardAvatarCreateProps) {

  //* ------------------- Generic React State ------------------------

  const displayNameRef = React.useRef('');
  const [selectedAvatar, setSelectedAvatar] = React.useState(-1);
  const [selectedDepartment, setSelectedDepartment] = React.useState('');


  //This function will return either the data needed for Avatar Creation, or an error with error msg
  //* [ Success_Status, Payload ]

  const handleAvatarCreate = () => {
    const nickname = displayNameRef.current.value;
    const avatar = selectedAvatar;
    const department = selectedDepartment;

    //! ---- Assertions ----
    if (nickname.length < 3 || nickname.length > 32) {
      onAction([false, "Nickname must be between 3 and 32 characters"]);
      return;
    }

    if (!Number.isInteger(avatar)) {
      onAction([false, "Avatar selection was invalid"]);
      return;
    }

    if (requiredOccupation && (!department || department.trim() === "")) {
      onAction([false, "Selected department cannot be blank"]);
      return;
    }

    //* Passed all Assertions, Successful Case:

    onAction([true, { nickname, avatar, department }]);
    return;
  }


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
            <Input id="name" placeholder="Enter nickname" ref={displayNameRef} />
          </div>

          {requiredOccupation &&
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="occupation">Department:</Label>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="occupation">
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
                    if (selectedAvatar == index) {
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

        {/* CLEAR BUTTON | Clear's entire Avatar Creation Section */}

        <Button variant="outline" onClick={() => {
          setSelectedAvatar(-1);
          displayNameRef.current.value = '';
          setSelectedDepartment('');
        }}>Clear</Button>

        <Button onClick={() => { handleAvatarCreate() }}>Join Room</Button>
      </CardFooter>
    </Card>
  );

}
