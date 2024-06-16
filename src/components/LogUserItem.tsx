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

import featheraUrl from '../assets/feathera.png'
import featherbUrl from '../assets/featherb.png'
import feathercUrl from '../assets/featherc.png'

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

    let speakerStyles = ' bg-gray-600'

    if (isSpeaker) {
        speakerStyles = ' bg-gray-500'
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

            {isSpeaker && (
                <center>
                    <img
                        src={featherbUrl}
                        style={{
                            animation: 'rock 1s infinite',
                            transformOrigin: '50% 50%',
                        }}
                    ></img>
                </center>
            )}

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
