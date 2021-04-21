import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import axios from 'axios'
import gpxParser from 'gpxparser'
import getRaceTypes from '../utils/getRaceTypes'
import Map from '../components/Map'

const Event = ({ map }) => {
    const [raceType, setRaceType] = useState(null)
    const [raceTypes, setRaceTypes] = useState([])
    const [route, setRoute] = useState(null)

    const { slug } = useParams()
    const GET_RACES = gql`
        query MyQuery($eventSlug: String!) {
            airtableEvent(eventSlug: $eventSlug) {
                date
                name
                description
                location
                heroPhotoURL
                races {
                    name
                    date
                    type
                    mapUrl
                    aidStations {
                        lat
                        lng
                        aidTypes
                        name
                    }
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

    useEffect(() => {
        if (data && !loading && !error) {
            async function fetchGPX() {
                const res = await axios.get(races[0].mapUrl)
                const data = res.data
                var gpx = new gpxParser() //Create gpxParser Object
                gpx.parse(data)
                const route = gpx.toGeoJSON()
                setRoute(route)
            }
            fetchGPX()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [raceType])

    if (error) return <p>{JSON.stringify(error)}</p>
    if (loading) return <p>Loading ...</p>
    const { airtableEvent } = data
    if (!airtableEvent) return <p>No Data</p> //TODO handle no event data
    const {
        date,
        name,
        heroPhotoURL,
        location,
        description,
        races,
    } = airtableEvent
    const dateString = dayjs(date).format('dddd MMMM DD, YYYY')
    const opacity = 0.6
    const rgb = 50
    const overlay = `rgba(${rgb}, ${rgb}, ${rgb}, ${opacity})`

    return (
        <div>
            <div
                className="rounded-sm h-80 text-center pt-4 text-gray-200"
                style={{
                    background: `linear-gradient(${overlay}, ${overlay}),
					url(${heroPhotoURL}) center center`,
                }}
            >
                <div className="text-5xl font-semibold">{name}</div>
                <div className="text-xl pt-4">{dateString}</div>
                <div className="text-xl pt-4">{location}</div>
            </div>
            <div className="mt-4 mx-4">
                <EventDescription description={description} />
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
                    <Map map={map} route={route} points={races[0].aidStations} />
                </div>
            </div>
        </div>
    )
}

const parseDescription = (description) => {
    const descriptionLines = []
    let paragraph = -1
    description.split(/[\n|\r]/g).forEach((line) => {
        if (/^\s*$/.test(line)) return
        if (/#+/g.test(line)) {
            paragraph++
            descriptionLines[paragraph] = {
                heading: line.replace(/#+\s+/g, ''),
                lines: [],
            }
        } else {
            descriptionLines[paragraph].lines.push(line)
        }
    })
    return descriptionLines
}

const EventDescription = ({ description }) => {
    const descriptionLines = parseDescription(description)
    return (
        <>
            {descriptionLines.map((line) => (
                <Line {...line} key={line.heading} />
            ))}
        </>
    )
}

const Line = ({ heading, lines }) => {
    return (
        <div className="my-8">
            <h2 className="text-2xl font-semibold mb-2">{heading}</h2>
            {lines.map((line, i) => {
                return <p key={i}>{line}</p>
            })}
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
