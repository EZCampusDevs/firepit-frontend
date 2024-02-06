    
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

import { WebSocketSingleton } from "../core/WebSocketSingleton"

type CardProps = React.ComponentProps<typeof Card>

interface CrowdCardProps {
    displayName: string;
    displayOccupation: string | null;
    clientUUID: string;
    isCallerSpeaking: boolean;
    avatarIndex: number; //TODO: implement into component
    VISUAL_rotation : string;
    VISUAL_top_margin: number;
}

export function CrowdCard(props: CrowdCardProps) {
    const { displayName, displayOccupation, isCallerSpeaking, clientUUID, VISUAL_top_margin, VISUAL_rotation } = props;
  

  return (
<Card className="w-[120px]" style={{ transform: `rotate(${VISUAL_rotation}deg)`, marginTop: `${VISUAL_top_margin}em` }}>

    {/* <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)] gap-4"> */}
    <CardHeader>
        <Avatar>
            <AvatarImage src={""} alt="avatar icon" />
            <AvatarFallback>{`1`}</AvatarFallback>
        </Avatar>
        
        <div>
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>{displayOccupation}</CardDescription>
        </div>
    </CardHeader>


      <CardContent className="grid gap-4">

      </CardContent>
      <CardFooter>
        { isCallerSpeaking &&
        <Button className="w-full" onClick={ () => {
          const ws_inst = WebSocketSingleton.getInstance();
          ws_inst.setSpeaker(clientUUID);
          }
        }>
          <Check className="mr-2 h-4 w-4" /> Pass the Stick
        </Button>
        }
      </CardFooter>
    </Card>
  )
}
