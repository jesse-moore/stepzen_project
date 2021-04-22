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
            <div className="relative" ref={mapContainer}>
                <div className="bg-white rounded absolute top-3 left-3 p-2 shadow z-10 ">
                    <h4 className="mb-2 font-semibold">Legend</h4>
                    <div className="flex flex-row items-center">
                        <div
                            className="rounded-full h-5 w-5 mr-2"
                            style={{ backgroundColor: '#A3E635', border: '#4D7C0F 2px solid' }}
                        ></div>
                        <div>Start / Finish</div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div
                            className="rounded-full h-5 w-5 mr-2"
                            style={{ backgroundColor: '#BFDBFE', border: '#1E3A8A 2px solid' }}
                        ></div>
                        <div>Aid Station Level 1</div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div
                            className="rounded-full h-5 w-5 mr-2"
                            style={{ backgroundColor: '#C4B5FD', border: '#5B21B6 2px solid' }}
                        ></div>
                        <div>Aid Station Level 2</div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div
                            className="rounded-full h-5 w-5 mr-2"
                            style={{ backgroundColor: '#FDBA74', border: '#9A3412 2px solid' }}
                        ></div>
                        <div>Restroom</div>
                    </div>
                </div>
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
