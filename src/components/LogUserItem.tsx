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

export function LogUserItem(props) {
    const {
        width,
        height,
        shouldHavePassStickButton,
        displayName,
        isSpeaker,
        clientUUID,
        passToSpeakerCallback,
        style,
    } = props

    const fullStyles = {
        width: width,
        height: height,
    }
    let speakerStyles = ''

    if (isSpeaker) {
        speakerStyles = ' bg-red-500'
    }

    if (style) {
        Object.assign(fullStyles, style)
    }

    return (
        <div
            className={
                'relative text-center inline-block rounded-md break-words' +
                speakerStyles
            }
            style={fullStyles}
        >
            <CardTitle>{displayName}</CardTitle>

            {shouldHavePassStickButton && !isSpeaker && (
                <Button
                    className="w-full"
                    onClick={() => passToSpeakerCallback(clientUUID)}
                >
                    Pass
                </Button>
            )}
        </div>
    )
}
