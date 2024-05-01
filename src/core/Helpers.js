export function RedirectTo(location) {
    window.location.href = location
}

export function SetStorageJSON(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

export function GetStorageJSON(key) {
    const ROOM_INFO_STR = window.localStorage.getItem(key)

    if (!ROOM_INFO_STR) {
        return null
    }

    try {
        return JSON.parse(ROOM_INFO_STR)
    } catch {
        return null
    }
}

export function RemoveStorage(key) {
    window.localStorage.removeItem(key)
}

export function JoinRoom(roomCode, username) {
    SetStorageJSON(roomCode, {
        code: roomCode,
        username: username,
    })

    RedirectTo(`/room/${roomCode}`)
}
