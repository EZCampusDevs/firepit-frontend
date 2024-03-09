    
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

interface VacantCardProps {
    VISUAL_rotation : string;
    VISUAL_top_margin: number;
}

export function VacantCard(props: VacantCardProps) {
    const { VISUAL_top_margin, VISUAL_rotation } = props;

    let WIDTH_STR = `w-[160px] h-[200px]`;

  return (
<Card className={WIDTH_STR} style={{ transform: `rotate(${VISUAL_rotation}deg)`, marginTop: `${VISUAL_top_margin}em` }}>

        ...
    </Card>
  )
}
