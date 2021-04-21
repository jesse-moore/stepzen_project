import mapboxgl from 'mapbox-gl'
// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
import * as turf from '@turf/turf'

class mapboxMap {
    constructor() {
        this.element = document.createElement('div')
        this.map = {}
        this.bounds = {}
        this.isLoaded = false
    }

    loadMap({ route, points }) {
        return new Promise((resolve) => {
            this.map = new mapboxgl.Map({
                container: this.element,
                style: 'mapbox://styles/mapbox/outdoors-v11',
                center: [-94.115251, 36.184605],
                maxZoom: 14,
                minZoom: 10,
            })
            const pointsGeoJSON = pointsToGeojson(points)

            this.bounds = getBounds(route)
            this.fitBounds()

            this.map.on('load', () => {
                this.map.scrollZoom.disable()
                this.map.doubleClickZoom.disable()
                this.map.addControl(
                    new mapboxgl.NavigationControl({ showCompass: false })
                )
                this.map.addSource('points', {
                    type: 'geojson',
                    data: pointsGeoJSON,
                })
                this.map.addSource('route', {
                    type: 'geojson',
                    data: route,
                })

                this.map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                        visibility: 'visible',
                    },
                    paint: {
                        'line-color': '#c40000',
                        'line-width': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            10,
                            1,
                            14,
                            3,
                        ],
                    },
                    minzoom: 9,
                })

                this.map.addLayer({
                    id: 'points',
                    type: 'circle',
                    source: 'points',
                    paint: {
                        'circle-color': '#BFDBFE',
                        'circle-stroke-color': '#1E3A8A',
                        'circle-stroke-width': 2,
                        'circle-radius': 10,
                    },
                    minzoom: 9,
                })

                this.isLoaded = true
                resolve()
            })

            this.map.on('click', async (e) => {
                const features = this.map.queryRenderedFeatures(e.point, {
                    layers: ['points'],
                })
                if (features.length === 0) return
                if (features[0].properties) {
                    console.log(features)
                    console.log(features[0].properties)
                }
            })

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            })

            this.map.on('mouseenter', 'points', function (e) {
                // Change the cursor style as a UI indicator.
                this.getCanvas().style.cursor = 'pointer'

                const coordinates = e.features[0].geometry.coordinates.slice()
                const { title, types } = e.features[0].properties
                const typesList = types
                    .split(', ')
                    .map((type) => {
                        return `<li>${type}</li>`
                    })
                    .join('')
                const description = `<h3 class="text-lg">${title}</h3><ul>${typesList}</ul>`

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(description).addTo(this)
            })

            this.map.on('mouseleave', 'points', function () {
                this.getCanvas().style.cursor = ''
                popup.remove()
            })
        })
    }

    fitBounds() {
        this.map.fitBounds(this.bounds, { padding: 100 })
    }

    loadSource({ pointsGeoJSON, linesGeoJSON }) {
        this.map.getSource('points').setData(pointsGeoJSON)
        this.map.getSource('route').setData(linesGeoJSON)
        this.bounds = getBounds(pointsGeoJSON)
        this.fitBounds()
    }
}

const pointsToGeojson = (points) => {
    const features = points.map(({ lat, lng, name, aidTypes }) => {
        return {
            // feature for Mapbox DC
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lng, lat],
            },
            properties: {
                title: name,
                types: aidTypes,
            },
        }
    })
    return { type: 'FeatureCollection', features }
}

export const getBounds = (geojson) => {
    const coordinates = geojson.features[0].geometry.coordinates
    const bounds = coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord)
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))
    return bounds
}

export default mapboxMap
