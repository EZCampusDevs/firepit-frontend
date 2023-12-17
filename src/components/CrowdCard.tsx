    
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

type CardProps = React.ComponentProps<typeof Card>

interface CrowdCardProps {
    isCallerSpeaking: boolean;
}

export function CrowdCard(props: CrowdCardProps) {
    const { isCallerSpeaking } = props;
  return (
    <Card className={cn("w-[250px]", "")}>

    <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
        <Avatar>
            <AvatarImage src={""} alt="avatar icon" />
            <AvatarFallback>{`1`}</AvatarFallback>
        </Avatar>
        
        <div>
            <CardTitle>Jason. M</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
        </div>
    </CardHeader>


      <CardContent className="grid gap-4">

      </CardContent>
      <CardFooter>
        { isCallerSpeaking &&
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Pass the Stick
        </Button>
}
      </CardFooter>
    </Card>
  )
}
