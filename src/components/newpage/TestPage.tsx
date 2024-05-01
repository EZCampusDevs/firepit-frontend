//* --- REACT & UI IMPORTS ---
import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
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
import { LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY } from '../../core/Constants'
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

export function TestPage() {
    const { ROOM } = useParams()
    const WHO_AM_I_KEY = `${ROOM}whoami`

    const [quote, setQuote] = React.useState('Loading...')

    const [width, setWidth] = React.useState(window.innerWidth)
    const [height, setHeight] = React.useState(window.innerHeight)

    const [selfSpeaking, setSelfSpeaking] = React.useState(false)

    const Room = useSelector((state) => state.room.room)
    const Crowd = Room ? Room.room_members : [] //useSelector((state) => state.room.room)
    const Speaker = useSelector((state) => state.room.speaker)
    const dispatch = useDispatch()

    function wsCallback(wsResponse) {
        switch (wsResponse.messageType) {
            case SocketMessage.CLIENT_WHO_AM_I:
                SetStorageJSON(WHO_AM_I_KEY, wsResponse.payload)
                return 0

            case SocketMessage.ROOM_INFO:
                dispatch(setRoom({ room: wsResponse.payload.room }))
                return 0

            case SocketMessage.CLIENT_JOIN_ROOM:
                dispatch(
                    appendParticipant({ newcomer: wsResponse.payload.client })
                )
                return 0

            case SocketMessage.CLIENT_LEAVE_ROOM:
                dispatch(
                    removeParticipant({ departer: wsResponse.payload.client })
                )
                return 0

            case SocketMessage.CLIENT_SET_SPEAKER:
                dispatch(
                    setSpeaker({ speaker_id: wsResponse.payload.speaker_id })
                )
                return 0
        }

        console.log('COMPONENT PRINT: ')
        console.log(wsResponse)
    }

    React.useEffect(() => {
        console.log('Crowd:  ======', Crowd, '=======')
        console.log('Speaker:  ======', Speaker, '=======')
        console.log('We got room code: ', ROOM)

        const ROOM_INFO = GetStorageJSON(ROOM)

        if (!ROOM || !ROOM_INFO) {
            RedirectTo('/')

            return
        }

        const wsManager = WebSocketSingleton.getInstance()

        const reconnect = GetStorageJSON(WHO_AM_I_KEY)

        RequestRoomExists(ROOM)
            .then((exists) => {
                console.log('Room exists')

                if (!exists) {
                    RedirectTo('/')
                    return
                }

                console.log('Room info: ', ROOM_INFO)

                wsManager.connect(
                    ROOM,
                    ROOM_INFO.username,
                    reconnect ? reconnect.reconnection_token : '',
                    wsCallback
                )
            })
            .catch((err) => console.log(err))
    }, [])

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
                            displayName={val.client_name}
                            displayOccupation={val.client_occupation}
                            key={val.client_id}
                            clientUUID={val.client_id}
                            isCallerSpeaking={val.isCallerSpeaking}
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

    function btnClick(e) {
        console.log(log_north.current)

        const paragraphElement = <p>Lorem ipsum dolor sit amet</p>

        // Append the paragraph element to the DOM node referenced by the ref
        if (log_north.current) {
            log_north.current.appendChild(paragraphElement)
        }
    }

    function leaveRoomClick() {
        console.log('leave room clicked')

        RemoveStorage(ROOM)
        RemoveStorage(WHO_AM_I_KEY)
        RedirectTo('/')
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

            <Button
                className="absolute bottom-0 right-0 m-2"
                onClick={leaveRoomClick}
                title="Leave the room. You will be able to join back using the same room code, but will lose your spot!"
            >
                Leave Room
            </Button>
        </div>
    )
}
