import React from 'react'
import { Link } from 'react-router-dom'
import slugify from 'slugify'
import { gql, useQuery } from '@apollo/client'
import getRaceTypes from '../utils/getRaceTypes'

const GET_EVENTS = gql`
    query MyQuery {
        airtablesEvents {
            name
            date
            slug
            address
            state
            city
            races {
                type
            }
        }
    }
`

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

export const EventList = () => {
    const { loading, error, data } = useQuery(GET_EVENTS)

    if (error) return <p>{JSON.stringify(error)}</p>
    if (loading) return <p>Loading ...</p>
    const { airtablesEvents } = data
    return (
        <>
            {airtablesEvents.map(({ ...event }, i) => (
                <Event {...event} key={event.slug} i={i} />
            ))}
        </>
    )
}

const Event = ({ name, date, city, state, races }) => {
    const slug = slugify(name, { lower: true })
    const types = getRaceTypes(races)
    return (
        <Link to={{ pathname: `/event/${slug}` }}>
            <div className="flex flex-row items-center min-h-full max-w-full shadow rounded p-4 my-4 bg-white flex-wrap min-w-min whitespace-nowrap">
                <div className="mr-auto relative">
                    <div className="text-2xl mb-2 text-gray-900">{name}</div>
                    <div className="flex flex-row">
                        {types.map((type) => (
                            <Type type={type} key={slug + type} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-row flex-wrap font-thin text-lg">
                    <div className="mr-auto w-36">{date}</div>
                    <div className="w-52">{`${city}, ${state}`}</div>
                </div>
            </div>
        </Link>
    )
}

const Type = ({ type }) => {
    return (
        <div
            style={{ backgroundColor: `${typeColor(type)}` }}
            className="py-1 px-2 mr-2 rounded-xl text-sm"
        >
            {type}
        </div>
    )
}

export default EventList
