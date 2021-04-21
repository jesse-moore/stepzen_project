import React, { useEffect, useRef } from 'react'

const Map = ({ map, route, points }) => {
    const mapContainer = useRef(null)

    useEffect(() => {
        mapContainer.current.appendChild(map.element)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log(route)
    useEffect(() => {
        if (!route) return
        async function loadMap() {
            if (!map.isLoaded) {
                await map.loadMap({ route, points })
            } else {
                // map.loadSource()
            }
        }
        loadMap()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route])

    // if (!map || !route) return null
    return (
        <div className="mt-4">
            <div ref={mapContainer}>
                <button
                    onClick={() => map.fitBounds()}
                    id="btn-fit-bounds"
                    className="fit-bounds-ctrl hover:bg-gray-100 bg-white absolute z-10 right-4 px-2 py-1 m-2 rounded font-semibold focus:outline-none;"
                >
                    Fit Bounds
                </button>
            </div>
        </div>
    )
}

export default Map
