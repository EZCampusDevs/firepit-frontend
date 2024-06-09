//* --- REACT & UI IMPORTS ---
import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    setSelf,
    setRoom,
    setSpeaker,
    appendParticipant,
    removeParticipant,
} from '../../redux/features/roomSlice'

//* --- Component IMPORTS ---
import { getRngQuote } from '../../core/Requests.js'
import { LogUserItem } from './LogUserItem'
import { Button } from '@/components/ui/button'

import {
    WebSocketSingleton,
    SocketMessage,
} from '../../core/WebSocketSingleton'
import {
    LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY,
    HTTP_HOST,
    RAW_HTTP_HOST,
    WEBSOCKET_PROT,
    DEBUG,
} from '../../core/Constants'
import {
    RedirectTo,
    GetStorageJSON,
    SetStorageJSON,
    RemoveStorage,
} from '../../core/Helpers.js'
import {
    RequestRoomExists,
    CreateJoinRoomQueryParam,
} from '../../core/Requests.js'

import firepiturl from '../../assets/firepit.gif'
import logurl from '../../assets/log.png'
import bgurl from '../../assets/bg.png'

function sortRoom(room) {
    if (room) room.room_members.sort((a, b) => b.order - a.order)
}

function leaveRoom(ROOM, WHO_AM_I_KEY) {
    console.log('leave room clicked')

    RemoveStorage(ROOM)
    RemoveStorage(WHO_AM_I_KEY)
    RedirectTo('/')
}

export function TestPage() {
    const { ROOM } = useParams()
    const WHO_AM_I_KEY = `${ROOM}whoami`

    const [webSocketReady, setWebSocketReady] = React.useState(false)
    const [webSocketURI, setWebSocketURI] = React.useState(null)
    const [webSocketReconnect, setWebSocketReconnect] = React.useState(0)

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

            switch (wsResponse.messageType) {
                case SocketMessage.CLIENT_WHO_AM_I:
                    SetStorageJSON(WHO_AM_I_KEY, wsResponse.payload)

                    setClientUUID(wsResponse.payload.client.client_id)

                    break

                case SocketMessage.ROOM_INFO:
                    sortRoom(wsResponse.payload.room)

                    setRoomInfo(wsResponse.payload.room)

                    setSpeaker(wsResponse.payload.room.room_speaker)

                    break

                case SocketMessage.CLIENT_SET_SPEAKER:
                    setSpeaker(wsResponse.payload)

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
                            class="inline w-[20%]"
                            shouldHavePassStickButton={IsSpeaking}
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

            {MakeAllLogs(width, height)}

            {clientUUID && (
                <Button
                    className="absolute top-0 right-0 m-2"
                    onClick={() => leaveRoom(ROOM, WHO_AM_I_KEY)}
                    title="Reconnecting..."
                >
                {clientUUID}
                </Button>
            )}
            {!webSocketReady && (
                <Button
                    className="absolute top-0 left-0 m-2"
                    onClick={() => leaveRoom(ROOM, WHO_AM_I_KEY)}
                    title="Reconnecting..."
                >
                    Reconnecting...
                </Button>
            )}

            <Button
                className="absolute bottom-0 right-0 m-2"
                onClick={() => leaveRoom(ROOM, WHO_AM_I_KEY)}
                title="Leave the room. You will be able to join back using the same room code, but will lose your spot!"
            >
                Leave Room
            </Button>
        </div>
    )
}
