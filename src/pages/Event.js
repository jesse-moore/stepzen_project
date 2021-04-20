import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import getRaceTypes from '../utils/getRaceTypes'

const Event = () => {
    const [raceType, setRaceType] = useState(null)
    const [raceTypes, setRaceTypes] = useState([])
    const { slug } = useParams()
    const GET_RACES = gql`
        query MyQuery($eventSlug: String!) {
            airtableEvent(eventSlug: $eventSlug) {
                date
                name
                races {
                    name
                    date
                    type
                }
            }
        }
    `
    const { loading, error, data } = useQuery(GET_RACES, {
        variables: { eventSlug: slug },
    })

    useEffect(() => {
        if (data && !loading && !error) {
            const { airtableEvent } = data
            if (!airtableEvent || !airtableEvent.races) return
            const types = getRaceTypes(airtableEvent.races)
            setRaceTypes(types)
            setRaceType(types[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    if (error) return <p>{JSON.stringify(error)}</p>
    if (loading) return <p>Loading ...</p>
    console.log(data)
    const { airtableEvent } = data
    if (!airtableEvent) return //TODO handle no event data
    const { date, name } = airtableEvent
    return (
        <div>
            <div className="border border-black h-80 text-center pt-4">
                <div className="text-4xl">{name}</div>
                <div className="text-xl pt-4">{date}</div>
                <div className="text-xl pt-4">Event Location</div>
            </div>
            <div className="mt-4 mx-4">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Description</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Packet Pickup</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Races</h2>
                    <div className="flex flex-row mt-2">
                        {raceTypes.map((type) => (
                            <Type
                                {...{ type, setRaceType, raceType }}
                                key={type}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const typeColor = (type) => {
    switch (type) {
        case '5k':
            return '#93C5FD'
        case '10k':
            return '#C7D2FE'
        case 'Half Marathon':
            return '#DDD6FE'
        case 'Marathon':
            return '#FBCFE8'
        case '50k':
            return '#FEE2E2'
        default:
            return '#E5E7EB'
    }
}

const typeStyle = (type, currentType) => {
    const color = typeColor(type)
    if (type === currentType) {
        return { backgroundColor: `${color}`, border: `2px solid tranparent` }
    } else {
        return { border: `${color} 2px solid` }
    }
}

const Type = ({ type, setRaceType, raceType }) => {
    return (
        <button
            style={typeStyle(type, raceType)}
            className="py-1 px-2 w-16 min-w-max mr-2 rounded-md text-sm text-center font-semibold focus:outline-none"
            onClick={() => setRaceType(type)}
        >
            {type}
        </button>
    )
}

export default Event
