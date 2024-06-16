var _WE_ARE_DEV
var _HTTP_HOST
var _RAW_HTTP_HOST
var _WEBSOCKET_PROT

const FORCE_PROD = false

if (
    !FORCE_PROD &&
    (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
) {
    _RAW_HTTP_HOST = 'localhost:3000'
    _HTTP_HOST = `http://${_RAW_HTTP_HOST}`
    _WEBSOCKET_PROT = 'ws'

    _WE_ARE_DEV = true
    console.log('We are Development')
} else {
    _RAW_HTTP_HOST = 'firepitapi.astoryofand.com'
    _HTTP_HOST = `https://${_RAW_HTTP_HOST}`
    _WEBSOCKET_PROT = 'wss'
    _WE_ARE_DEV = false
}

export const HTTP_HOST = _HTTP_HOST
export const RAW_HTTP_HOST = _RAW_HTTP_HOST

export const WEBSOCKET_PROT = _WEBSOCKET_PROT

export const LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY = 'requested_self'

export const DEBUG = _WE_ARE_DEV

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
