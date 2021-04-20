import React from 'react'
import EventList from '../components/EventList'

const Home = () => {
    return (
        <>
            <h1 className="text-3xl pl-4">Events</h1>
            <div className="mx-4">
                <EventList />
            </div>
        </>
    )
}

export default Home
