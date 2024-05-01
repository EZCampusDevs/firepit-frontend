import { HTTP_HOST } from './Constants'

// -------- Creation of a Room FUNCTION --------:
//* 1. Make's the POST Request to Create a Room
//* 2. Trigger's the accessing of a Room with Avatar Details

export function RequestNewRoomCode() {
    return fetch(`${HTTP_HOST}/room/new`, { method: 'GET' }).then((response) =>
        response.text()
    )
}

export function RequestRoomExists(roomId) {
    return fetch(`${HTTP_HOST}/room/${roomId}`, { method: 'GET' })
        .then((response) => response.json())
        .then((j) => j.room_exists)
}

export function CreateJoinRoomQueryParam(roomId, displayName, rtoken) {
    var t = ''
    if (rtoken) {
        t = `&rtoken=${rtoken}`
    }

    const roomPayload =
        `?rid=${encodeURIComponent(roomId.trim())}` +
        `&name=${encodeURIComponent(displayName.trim())}` +
        t

    return roomPayload
}

export function roomStringEncodeAndAccess(
    roomId,
    displayName,
    displayOccupation,
    avatarIndexInt
) {
    const roomPayload =
        `?rid=${encodeURIComponent(roomId.trim())}` +
        `&name=${encodeURIComponent(displayName.trim())}` +
        `&occup=${encodeURIComponent(displayOccupation.trim())}` +
        `&avatar=${encodeURIComponent(avatarIndexInt)}`

    return roomPayload
}

function getOKMessage() {
    return JSON.stringify({
        messageType: 200,
    })
}

export async function getRngQuote(callback) {
    try {
        const response = await fetch(`${HTTP_HOST}/quote`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        callback(data.quote) // Call the callback with the quote
    } catch (error) {
        console.error('Error fetching quote:', error)
        callback('Failed to load quote.') // Call the callback with error message
    }
}
