import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <div className="mb-4 py-4 w-full flex flex-row justify-center">
            <Link to="/">
                <div className="m-4 text-gray-800 text-4xl">
                    Awesome Run Club
                </div>
            </Link>
        </div>
    )
}

export default NavBar
