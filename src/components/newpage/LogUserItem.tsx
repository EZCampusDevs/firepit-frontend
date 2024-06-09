import { Check } from 'lucide-react'

import { useSelector, useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { WebSocketSingleton } from '../../core/WebSocketSingleton'

interface LogUserItemProps {
    displayName: string
    displayOccupation: string | null
    clientUUID: string
    isCallerSpeaking: boolean
    avatarIndex: number //TODO: implement into component
    VISUAL_rotation: string
    VISUAL_top_margin: number
}

export function LogUserItem(props: LogUserItemProps) {
    const {
        shouldHavePassStickButton,
        displayName,
        displayOccupation,
        isSpeaker,
        clientUUID,
        VISUAL_top_margin,
        VISUAL_rotation,
    } = props

    let a = ''

    if (isSpeaker) {
        a = ' bg-red-500'
    }

    return (
        <div className={'relative inline-block h-full' + a}>
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>{displayOccupation}</CardDescription>

            {shouldHavePassStickButton && !isSpeaker && <Button>Pass</Button>}
        </div>
    )
}
