export function assertJoinRoom(
    nickname,
    avatar,
    department,
    requireOccupation,
    roomCodeInput
) {
    //! ---- Assertions ----
    if (nickname.length < 3 || nickname.length > 32) {
        return [false, 'Nickname must be between 3 and 32 characters long.']
    }

    if (!Number.isInteger(avatar)) {
        return [false, 'Avatar selection was invalid... Try again.']
    }

    if (requireOccupation && (!department || department.trim() === '')) {
        return [false, 'Selected department CANNOT be left blank.']
    }

    if (!roomCodeInput) {
        return [false, 'Enter a valid room code!']
    }

    //* Passed all Assertions, Successful Case:

    return [true, '']
}

//This function will return either the data needed for Avatar Creation, or an error with error msg
//* [ Success_Status, Payload ]

export function assertCreateRoom(
    nickname,
    avatar,
    department,
    requireOccupation,
    roomName
) {
    if (nickname.length < 3 || nickname.length > 32) {
        return [false, 'Nickname must be between 3 and 32 characters long.']
    }

    if (roomName.length < 3 || roomName.length > 64) {
        return [false, 'Room name must be between 3 and 64 characters long.']
    }

    if (!Number.isInteger(avatar)) {
        return [false, 'Avatar selection was invalid... Try again.']
    }

    if (requireOccupation && (!department || department.trim() === '')) {
        return [false, 'Selected department CANNOT be left blank.']
    }

    //* Passed all Assertions, Successful Case:

    return [true, '']
}
