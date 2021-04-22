import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import dayjs from 'dayjs'
import axios from 'axios'
import gpxParser from 'gpxparser'
import getRaceTypes from '../utils/getRaceTypes'
import Map from '../components/Map'

const Event = ({ map }) => {
    const [raceType, setRaceType] = useState(null)
    const [raceTypes, setRaceTypes] = useState([])
    const [route, setRoute] = useState(null)
    const [points, setPoints] = useState([])

    const { slug } = useParams()
    const GET_RACES = gql`
        query MyQuery($eventSlug: String!) {
            airtableEvent(eventSlug: $eventSlug) {
                date
                name
                description
                address
				city
				state
                heroImg {
                    url
                }
                races {
                    name
                    date
                    type
                    map {
                        url
                    }
                    markers {
                        lat
                        lng
                        aidTypes
                        name
                        type
                    }
                }
            }
        }
    `
    const [getRaces, { loading, data, error }] = useLazyQuery(
        GET_RACES,
        {
            variables: { eventSlug: slug },
        }
    )

    useEffect(() => {
        getRaces()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let isMounted = true
        if (data && !loading && !error) {
            const { airtableEvent } = data
            if (!airtableEvent || !airtableEvent.races) return
            if (raceType === null) {
                const types = getRaceTypes(airtableEvent.races)
                if (isMounted) {
                    setRaceTypes(types)
                    setRaceType(types[0])
                }
            } else {
                const race = airtableEvent.races.find((race) => {
                    return race.type === raceType
                })
                if (!race || !race.map || !race.map[0] || !race.map[0].url) {
                    return
                }
                async function fetchGPX() {
                    const res = await axios.get(race.map[0].url)
                    return res.data
                }

                async function loadMapSource() {
                    const data = await fetchGPX()
                    var gpx = new gpxParser()
                    gpx.parse(data)
                    const route = gpx.toGeoJSON()
                    if (isMounted) {
                        setRoute(route)
                        setPoints(race.markers)
                    }
                }
                loadMapSource()
            }
        }
        return () => {
            isMounted = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, raceType])

    if (error) return <p>{JSON.stringify(error)}</p>
    if (loading) return <p>Loading ...</p>
    const airtableEvent = data ? data.airtableEvent : null
    if (!airtableEvent) return <p>No Data</p> //TODO handle no event data
    const { date, name, heroImg, address, city, state, description } = airtableEvent

    return (
        <div>
            <div className="mt-4 mx-4">
                <Hero {...{ date, name, heroImg, address, city, state }} />
                <EventDescription description={description} />
                <div>
                    <h2 className="text-2xl font-semibold">Races</h2>
                    <div className="flex flex-row mt-2">
                        {raceTypes.map((type) => {
                            if (!route) {
                                return (
                                    <TypeList
                                        {...{ type, raceType }}
                                        key={type}
                                    />
                                )
                            } else {
                                return (
                                    <TypeButtons
                                        {...{ type, setRaceType, raceType }}
                                        key={type}
                                    />
                                )
                            }
                        })}
                    </div>
                    {route ? (
                        <Map map={map} route={route} points={points} />
                    ) : null}
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

const Hero = ({ date, name, heroImg, address, city, state }) => {
    const dateString = dayjs(date).format('dddd MMMM DD, YYYY')
    return (
        <HeroImg heroImg={heroImg}>
            <div className="text-5xl font-semibold">{name}</div>
            <div className="text-xl pt-4">{dateString}</div>
            <div className="text-xl pt-4">{address}</div>
            <div className="text-xl">{`${city}, ${state}`}</div>
        </HeroImg>
    )
}

const HeroImg = ({ heroImg, children }) => {
    const [img] = heroImg
    if (!img || !img.url) {
        const opacity = 0.6
        const rgbTop = 50
        const rgbBottom = 100
        const overlayTop = `rgba(${rgbTop}, ${rgbTop}, ${rgbTop}, ${opacity})`
        const overlayBottom = `rgba(${rgbBottom}, ${rgbBottom}, ${rgbBottom}, ${opacity})`
        return (
            <div
                className="rounded-sm h-80 text-center pt-4 text-gray-200"
                style={{
                    background: `linear-gradient(${overlayTop}, ${overlayBottom})`,
                }}
            >
                {children}
            </div>
        )
    } else {
        const opacity = 0.6
        const rgb = 50
        const overlay = `rgba(${rgb}, ${rgb}, ${rgb}, ${opacity})`
        return (
            <div
                className="rounded-sm h-80 text-center pt-4 text-gray-200"
                style={{
                    background: `linear-gradient(${overlay}, ${overlay}),
				url(${img.url}) center center`,
                }}
            >
                {children}
            </div>
        )
    }
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

const TypeButtons = ({ type, setRaceType, raceType }) => {
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

const TypeList = ({ type, raceType }) => {
    return (
        <div
            style={typeStyle(type, raceType)}
            className="py-1 px-2 w-16 min-w-max mr-2 rounded-md text-sm text-center font-semibold"
        >
            {type}
        </div>
    )
}

export default Event
