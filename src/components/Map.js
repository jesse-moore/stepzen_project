import React, { useEffect, useRef, useState } from 'react'

const Map = ({ map, route, points }) => {
    const [mapIsLoaded, setMapIsLoaded] = useState(map.isLoaded)
    const mapContainer = useRef(null)

    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            mapContainer.current.appendChild(map.element)
        }
        async function loadMap() {
            if (!map.isLoaded) {
                await map.loadMap({ route, points })
                if (isMounted) {
                    setMapIsLoaded(map.isLoaded)
                }
            }
        }
        loadMap()

        return () => {
            isMounted = false
            map.removeSources()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!mapIsLoaded || !route) return
        map.loadSource({ route, points })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route, points, mapIsLoaded])

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
