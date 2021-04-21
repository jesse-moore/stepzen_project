import React from 'react'

const EventNavBar = () => {
    const links = [1, 2, 3]
    return (
        <div className="mb-4 bg-gray-300 w-full rounded rounded-b-none shadow flex flex-row justify-end">
            {links.map((link) => {
                return <div className="py-2">Link {link}</div>
            })}
        </div>
    )
}

export default EventNavBar
