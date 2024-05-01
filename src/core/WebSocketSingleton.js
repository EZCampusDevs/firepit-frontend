import { HTTP_HOST, RAW_HTTP_HOST, WEBSOCKET_PROT, DEBUG } from './Constants'
import { CreateJoinRoomQueryParam } from './Requests.js'

export const SocketMessage = {
    SET_CLIENT_NAME: 10,
    CLIENT_SET_SPEAKER: 30,
    CLIENT_LEAVE_ROOM: 40,
    CLIENT_JOIN_ROOM: 50,
    CLIENT_WHO_AM_I: 100,
    ROOM_INFO: 60,
    SERVER_OK_MESSAGE: 200,
    SERVER_BAD_MESSAGE: 400,
}

export class WebSocketSingleton {
    static instance = null

    static getInstance() {
        if (WebSocketSingleton.instance === null) {
            WebSocketSingleton.instance = new WebSocketSingleton()
        }
        return WebSocketSingleton.instance
    }

    constructor() {
        this.ws = null
        this.HTTP_HOST = HTTP_HOST
        this.RAW_HOST = RAW_HTTP_HOST
        this.WS_PREFIX = WEBSOCKET_PROT
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN
    }

    connect(room, username, reconnectToken, callback) {
        if (!room) {
            console.warn('ERROR CONNECTING: given room is invalid')
            return
        }

        if (!username) {
            console.warn('ERROR CONNECTING: given username is invalid')
            return
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.warn('ERROR CONNECTING: Already in a room')
            return
        }

        if (this.ws) {
            this.ws.close()
        }

        const JOIN_QUERY = CreateJoinRoomQueryParam(
            room,
            username,
            reconnectToken
        )
        const SOCKET_CONNECTION_STRING = `${this.WS_PREFIX}://${this.RAW_HOST}/ws${JOIN_QUERY}`

        this.ws = new WebSocket(SOCKET_CONNECTION_STRING)

        this.ws.onopen = function () {
            console.log('websocket open')
        }

        this.ws.onclose = function () {
            console.log('websocket closed')
        }

        this.ws.onerror = function (event) {
            console.log('WebSocket error: ', event)
        }

        this.ws.onmessage = function (event) {
            // console.log("got ws message");
            const json = JSON.parse(event.data)

            // if (DEBUG) {
            console.log(json)
            // }

            callback(json)
        }

        // const ws = this.ws;
        // setInterval(() => {
        //
        //     console.log(ws.readyState === WebSocket.OPEN);
        // }, 1000);
    }

    //* passingToUUID, I'm passing the stick to UUID:
    setSpeaker(passingToUUID) {
        console.log('Trying to send Speaker Set MSG')

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
                JSON.stringify({
                    messageType: 30,
                    payload: {
                        speaker_id: passingToUUID,
                    },
                })
            )
        } else {
            console.error('SET SPEAKER ERROR; WebSocket is not open.')
        }
    }
}
