import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'

import { TabsContent } from '@/components/ui/tabs'
import { CardAvatarCreate } from '../CardAvatarCreate'

import { JoinRoom } from '../../core/Helpers.js'
import { DEBUG } from '../../core/Constants.js'
import { assertJoinRoom } from '../../core/assert'

import { ErrorAlert } from '../ErrorAlert'

export function JoinRoomPage() {
    //* ------ Join Room State(s) & Constants ------

    const [errMsg, setErrMsg] = React.useState('')

    const REQ_OCCUP = false

    const roomCodeInput = React.useRef('')

    function showError(err) {
        if (DEBUG) {
            console.warn(err)
        }
        setErrMsg(err)
    }

    return (
        <TabsContent value="join">
            <Card>
                <CardHeader>
                    <CardTitle>Room Access Code</CardTitle>
                    <div></div>
                    <Input
                        type="text"
                        placeholder="e.g., A1B2C3"
                        ref={roomCodeInput}
                        sizeStyle={'h-12'}
                    />
                </CardHeader>
                <hr />
                <CardHeader>
                    <CardTitle>Create Your Profile</CardTitle>
                    <CardDescription>
                        Select a unique nickname and choose your avatar.
                    </CardDescription>
                </CardHeader>

                <div className="flex justify-center mb-4">
                    <CardAvatarCreate
                        onAction={(value) => {
                            if (!value[0]) {
                                return
                            }

                            const nickname = value[1]
                            const avatar = value[2]
                            const department = value[3]

                            const roomCode = roomCodeInput.current.value

                            const [valid, errorMessage] = assertJoinRoom(
                                nickname,
                                avatar,
                                department,
                                REQ_OCCUP,
                                roomCode
                            )

                            if (!valid) {
                                showError(errorMessage)
                                return
                            }

                            JoinRoom(roomCode, nickname)
                        }}
                        requireOccupation={REQ_OCCUP}
                    />
                </div>

                <ErrorAlert error_msg={errMsg} />
            </Card>
        </TabsContent>
    )
}
