import React from 'react'
import { CrowdCard } from '../CrowdCard'

import { SpeakerCard } from '../SpeakerCard'

import { VacantCard } from '../VacantCard'

import { useSelector } from 'react-redux'

//* ------------ SIMPLE VIEW COMPONENT -----------------

interface SimpleRoomViewProps {
    isCallerSpeaking: boolean // If the user is speaking, this will be true
}

export function CircleSegmentRoomView(props: SimpleRoomViewProps) {
    const { isCallerSpeaking } = props

    const [crowdJSX, setCrowdJSX] = React.useState([])

    const Crowd = useSelector((state: any) => state.room.crowd) //Only the Crowd (Non-Speakers)

    //React was bugging me abt this being an Empty arrow fn... fml
    React.useEffect(() => {
        console.log('')
    }, [Crowd])

    // ---------------------------

    //Fixed 13x13 circle

    const N_C = 7

    const rotCircleApproach = (columnIndex: any) => {
        const XY_Midpoint = Math.ceil(N_C / 2) - 1 //Account for X and Y circle midpoint

        const col_pt = Math.pow(Math.abs(columnIndex - XY_Midpoint), 2) * 5 - 20

        // Calculate the absolute difference between the columnIndex and the midpoint
        const diff = Math.abs(columnIndex - XY_Midpoint)

        // Scale the difference to an angle. Assuming the maximum distance equals an angle of 60 degrees.
        // Adjust the scaling factor based on the maximum expected difference to reach up to 60 degrees.
        const maxDiff = N_C / 0.3 // Maximum difference from the midpoint to the edge of the array
        const angle = (diff / maxDiff) * 90 // Scale the difference to an angle

        if (columnIndex === XY_Midpoint) {
            return ['0', col_pt]
        }

        if (columnIndex > XY_Midpoint) {
            return [`${angle.toFixed(0)}`, col_pt] // Keep it negative for columnIndex greater than midpoint
        }

        return [`-${angle.toFixed(0)}`, col_pt] // Positive for columnIndex less than midpoint
    }

    const halfCircBuilder = () => {
        const XY_Midpoint = Math.ceil(N_C / 2) - 1 //Account for X and Y circle midpoint
        const maxSpots = XY_Midpoint + 1 // Maximum spots for CrowdCards
        let participantsCounter = 0 //

        const rowCells = []
        for (let columnIndex = 0; columnIndex < N_C; columnIndex++) {
            let isActive = rotCircleApproach(columnIndex)

            // Place SpeakerCard at the midpoint
            if (columnIndex === XY_Midpoint) {
                rowCells.push(<SpeakerCard key="speaker" />)
                continue
            }

            let crowdJSX = []
            for (const participant of Crowd) {
                crowdJSX.push(
                    <CrowdCard
                        displayName={participant.client_name}
                        displayOccupation={participant.client_occupation}
                        key={participant.client_id}
                        clientUUID={participant.client_id}
                        isCallerSpeaking={isCallerSpeaking}
                        avatarIndex={1}
                        VISUAL_rotation={isActive[0]}
                        VISUAL_top_margin={isActive[1]}
                        Width={100}
                    />
                )
            }

            const ActiveSpotCheck =
                columnIndex >= maxSpots &&
                participantsCounter <= crowdJSX.length - 1 &&
                crowdJSX.length

            if (ActiveSpotCheck) {
                console.log('checking for: ' + participantsCounter)
                const cardJsx = crowdJSX[participantsCounter++]

                rowCells.push(
                    <td
                        key={columnIndex}
                        className={`px-4 ${isActive ? 'text-lg font-semibold' : 'text-sm font-normal'}`}
                        style={{
                            height: isActive ? '100px' : 'auto',
                        }}
                    >
                        {cardJsx}
                    </td>
                )
            } else {
                rowCells.push(
                    <td
                        key={columnIndex}
                        className={`px-4 ${isActive ? 'text-lg font-semibold' : 'text-sm font-normal'}`}
                        style={{
                            height: isActive ? '100px' : 'auto',
                        }}
                    >
                        <VacantCard
                            VISUAL_rotation={isActive[0]}
                            VISUAL_top_margin={isActive[1]}
                        />
                    </td>
                )
            }
        }

        return <tr>{rowCells}</tr>
    }

    // Main Retrun stmt

    return (
        <>
            <div className="overflow-x-none">
                <table className="w-full">{halfCircBuilder()}</table>
            </div>
        </>
    )
}
