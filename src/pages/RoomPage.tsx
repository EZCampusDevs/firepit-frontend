//* --- REACT & UI IMPORTS ---
import React from 'react'
import { useParams } from 'react-router-dom'

//* --- Component IMPORTS ---
import { getRngQuote } from '../core/Requests.js'
import { LogUserItem } from '../components/LogUserItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
    SocketMessage,
    RAW_HTTP_HOST,
    WEBSOCKET_PROT,
    HTTP_HOST,
    DEBUG,
} from '../core/Constants'
import {
    RedirectTo,
    GetStorageJSON,
    SetStorageJSON,
    RemoveStorage,
} from '../core/Helpers.js'
import {
    RequestRoomExists,
    CreateJoinRoomQueryParam,
    WebsocketSetSpeakerTo,
} from '../core/Requests.js'

import firepiturl from '../assets/firepit.gif'
import logurl from '../assets/log.png'
import bgurl from '../assets/bg.png'

function sortRoom(room) {
    if (room) room.room_members.sort((a, b) => b.order - a.order)
}

function leaveRoom(ROOM, WHO_AM_I_KEY) {
    console.log('leave room clicked')

    RemoveStorage(ROOM)
    RemoveStorage(WHO_AM_I_KEY)
    RedirectTo('/')
}

export function RoomPage() {
    const { ROOM } = useParams()
    const WHO_AM_I_KEY = `${ROOM}whoami`

    const [webSocket, setWebSocket] = React.useState(null)
    const [webSocketReady, setWebSocketReady] = React.useState(false)
    const [webSocketURI, setWebSocketURI] = React.useState(null)
    const [webSocketReconnect, setWebSocketReconnect] = React.useState(0)

    const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false)
    const [quote, setQuote] = React.useState('Loading...')
    const [clientUUID, setClientUUID] = React.useState('')

    const [width, setWidth] = React.useState(window.innerWidth)
    const [height, setHeight] = React.useState(window.innerHeight)

    const [roomInfo, setRoomInfo] = React.useState({})
    const [speaker, setSpeaker] = React.useState({})

    const Crowd = roomInfo && roomInfo.room_members ? roomInfo.room_members : []
    const IsSpeaking =
        speaker && speaker.client_id ? speaker.client_id === clientUUID : false

    console.log(
        `We are client: ${clientUUID} Speaking: ${IsSpeaking} SpeakerID: ${speaker ? speaker.client_id : null}`
    )

    // Manage WebSocket connection creation
    React.useEffect(() => {
        console.log('Connecting to websocket: ', webSocketReconnect)

        if (!webSocketURI || webSocketReady) {
            return
        }

        console.log('Got new websocket URI: ', webSocketURI)

        const newWebSocket = new WebSocket(webSocketURI)

        newWebSocket.onopen = () => {
            setWebSocketReady(true)
        }

        newWebSocket.onmessage = (event) => {
            const wsResponse = JSON.parse(event.data)

            console.log('000000000000000 ', wsResponse)

            switch (wsResponse.messageType) {
                case SocketMessage.CLIENT_WHO_AM_I:
                    SetStorageJSON(WHO_AM_I_KEY, wsResponse.payload)

                    setClientUUID(wsResponse.payload.client.client_id)

                    break

                case SocketMessage.ROOM_INFO:
                    sortRoom(wsResponse.payload.room)

                    setRoomInfo(wsResponse.payload.room)

                    console.log(
                        'Setting speaker: ',
                        wsResponse.payload.room.room_speaker
                    )
                    setSpeaker(wsResponse.payload.room.room_speaker)

                    break

                case SocketMessage.CLIENT_SET_SPEAKER:
                    console.log('Setting speaker: ', wsResponse.payload)
                    setSpeaker(wsResponse.payload.client)

                    break

                case SocketMessage.CLIENT_JOIN_ROOM:
                    setRoomInfo((prevRoomInfo) => {
                        const newRoom = { ...prevRoomInfo }

                        newRoom.room_members = [
                            ...prevRoomInfo.room_members,
                            wsResponse.payload.client,
                        ]

                        sortRoom(newRoom)

                        return newRoom
                    })

                    break

                case SocketMessage.CLIENT_LEAVE_ROOM:
                    setRoomInfo((prevRoomInfo) => {
                        const newRoom = { ...prevRoomInfo }

                        newRoom.room_members = prevRoomInfo.room_members.filter(
                            (member) =>
                                member.client_id !==
                                wsResponse.payload.client.client_id
                        )

                        sortRoom(newRoom)

                        return newRoom
                    })

                    break

                default:
                    console.log('Unknown message type:', wsResponse.messageType)
                    break
            }
        }

        newWebSocket.onclose = () => {
            setWebSocketReady(false)

            setTimeout(() => {
                console.warn('Websocket disconnected. Trying again.')
                setWebSocketReconnect(webSocketReconnect + 1)
            }, 1000)
        }

        newWebSocket.onerror = (err) => {
            console.log(
                'Socket encountered error: ',
                err.message,
                'Closing socket'
            )
            newWebSocket.close()
            setWebSocketReady(false)
        }

        setWebSocket(newWebSocket)

        return () => {
            if (newWebSocket) newWebSocket.close()
        }
    }, [webSocketURI, webSocketReconnect, WHO_AM_I_KEY])

    // Handle initial connection setup
    React.useEffect(() => {
        const ROOM_INFO = GetStorageJSON(ROOM)

        if (!ROOM || !ROOM_INFO) {
            leaveRoom(ROOM, WHO_AM_I_KEY)
            return
        }

        const reconnect = GetStorageJSON(WHO_AM_I_KEY)

        RequestRoomExists(ROOM)
            .then((exists) => {
                if (!exists) {
                    leaveRoom(ROOM, WHO_AM_I_KEY)
                    return
                }

                const JOIN_QUERY = CreateJoinRoomQueryParam(
                    ROOM,
                    ROOM_INFO.username,
                    reconnect ? reconnect.reconnection_token : ''
                )

                const SOCKET_CONNECTION_STRING = `${WEBSOCKET_PROT}://${RAW_HTTP_HOST}/ws${JOIN_QUERY}`
                setWebSocketURI(SOCKET_CONNECTION_STRING)
            })
            .catch((err) => console.log(err))
    }, [ROOM, WHO_AM_I_KEY])

    React.useEffect(() => {
        getRngQuote((fetchedQuote) => {
            setQuote(fetchedQuote)
        })

        const handleResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const showInviteDialog = () => {
        setInviteDialogOpen(true)
    }

    const hideInviteDialog = () => {
        setInviteDialogOpen(false)
    }

    const websocketSetTheNewSpeaker = (passingToUUID) => {
        if (!webSocket) {
            console.warn('Cannot set speaker because websocket is null')

            return
        }

        if (webSocket.readyState !== WebSocket.OPEN) {
            console.warn('Cannot set speaker because websocket is not open')

            setWebSocketReconnect(webSocketReconnect + 1)

            return
        }

        console.log(`Setting the speaker to ${passingToUUID}`)

        WebsocketSetSpeakerTo(webSocket, passingToUUID)
    }

    const MakeLog = (children, url, scale, rotation, width, height, x, y) => {
        // this makes top and left css adjust by the center of the element
        // this is important because it is unaware of the rotation
        const offsetTop = -height / 2
        const offsetLeft = -width / 2

        return (
            <div
                // ref={refe}
                src={url}
                // draggable={false}
                className="absolute flex justify-evenly"
                style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                    transformOrigin: 'center center',
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    maxWidth: `${width}px`,
                    maxHeight: `${height}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    left: `${offsetLeft + x}px`,
                    top: `${offsetTop + y}px`,
                }}
            >
                {children.map((val) => {
                    return (
                        <LogUserItem
                            width={width / 5}
                            height={height}
                            style={{
                                transform: `rotate(${-rotation}deg)`,
                            }}
                            class="inline w-[20%]"
                            shouldHavePassStickButton={IsSpeaking}
                            passToSpeakerCallback={websocketSetTheNewSpeaker}
                            displayName={val.client_name}
                            displayOccupation={val.client_occupation}
                            key={val.client_id}
                            clientUUID={val.client_id}
                            isSpeaker={
                                speaker && speaker.client_id === val.client_id
                            }
                            avatarIndex={1}
                        />
                    )
                })}
            </div>
        )
    }

    const MakeAllLogs = (w, h) => {
        const scale = 1

        const sWidth = w
        const sHeight = h

        const iWidth = 512 * scale
        const iHeight = 128 * scale

        const width = iWidth / 1.2
        const height = iHeight / 1.2

        return (
            <>
                {
                    // North
                    MakeLog(
                        Crowd.slice(0, 5),
                        logurl,
                        scale,
                        0,
                        width,
                        height,
                        sWidth / 2,
                        sHeight / 8
                    )
                }

                {
                    // North West
                    MakeLog(
                        Crowd.slice(5, 10),
                        logurl,
                        scale,
                        90 + 25,
                        width,
                        height,
                        sWidth / 7,
                        sHeight / 3
                    )
                }

                {
                    // South West
                    MakeLog(
                        Crowd.slice(10, 15),
                        logurl,
                        scale,
                        90 - 35,
                        width,
                        height,
                        sWidth / 6,
                        sHeight - sHeight / 4
                    )
                }

                {
                    // South
                    MakeLog(
                        Crowd.slice(15, 20),
                        logurl,
                        scale,
                        0,
                        width,
                        height,
                        sWidth / 2,
                        sHeight - sHeight / 15
                    )
                }

                {
                    // South East
                    MakeLog(
                        Crowd.slice(20, 25),
                        logurl,
                        scale,
                        -45,
                        width * 0.8,
                        height,
                        sWidth - sWidth / 6,
                        sHeight - sHeight / 4
                    )
                }
            </>
        )
    }

    const bottomBarHeight = 64

    return (
        <div
            className="flex flex-col justify-between items-center w-full h-screen"
            style={{
                backgroundImage: `url(${bgurl})`,
                backgroundSize: 'cover',
                backgroundColor: 'rgba(0,0,0,0.4)',
                backgroundBlendMode: 'darken',
            }}
        >
            <div className="flex items-center justify-center h-screen w-screen">
                <img
                    className="select-none"
                    src={firepiturl}
                    draggable={false}
                ></img>
            </div>

            {MakeAllLogs(width, height - bottomBarHeight)}

            <div
                className="absolute right-0 bg-gray-500 rounded-s"
                style={{
                    bottom: `${bottomBarHeight}px`,
                    // backgroundSize: 'cover',
                    // backgroundImage: `url(${logurl})`,
                    height: inviteDialogOpen ? '200px' : '0px',
                    width: inviteDialogOpen ? '500px' : '500px',
                    visibility: inviteDialogOpen ? 'visible' : 'hidden',
                    transition: 'height 0.5s, visibility 0.35s ease',
                }}
            >
                {inviteDialogOpen && (
                    <div className="w-full h-full flex-col flex-grow">
                        <div className="flex justify-end p-2">
                            <Button onClick={hideInviteDialog}>X</Button>
                        </div>

                        <div className="mx-2">
                            <h2 className="text-lg font-medium">
                                Share this link
                            </h2>
                            <Input
                                readOnly
                                type="text"
                                value={'https://firepit.astoryofand.com/join/' + ROOM}
                                sizeStyle={'h-12'}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div
                className="flex bottom-0 w-full h-16 bg-gray-500"
                style={{
                    backgroundImage: `url(${logurl})`,
                }}
            >
                <Button
                    className="mx-1 my-2"
                    onClick={() => leaveRoom(ROOM, WHO_AM_I_KEY)}
                    title="Leave the room. You will be able to join back using the same room code, but will lose your spot!"
                >
                    Leave Room
                </Button>

                {DEBUG && clientUUID && (
                    <Button
                        className="mx-1 my-2"
                        onClick={() => leaveRoom(ROOM, WHO_AM_I_KEY)}
                        title="Reconnecting..."
                    >
                        {clientUUID}
                    </Button>
                )}

                {!webSocketReady && (
                    <Button
                        className="mx-1 my-2"
                        title="Connection has been lost, reconnecting..."
                    >
                        Connection has been lost, reconnecting...
                    </Button>
                )}
                <Button
                    className="ml-auto mr-1 my-2"
                    onClick={showInviteDialog}
                >
                    Invite To Room
                </Button>
            </div>
        </div>
    )
}
