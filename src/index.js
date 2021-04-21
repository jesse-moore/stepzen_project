import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import './styles/index.css'
import './styles/utilities.css'
import './styles/components.css'

const {
    REACT_APP_STEPZEN_API_KEY,
    REACT_APP_STEPZEN_URI,
    REACT_APP_MAPBOX_KEY,
} = process.env
mapboxgl.accessToken = REACT_APP_MAPBOX_KEY

const client = new ApolloClient({
    cache: new InMemoryCache(),
    headers: {
        Authorization: `Apikey ${REACT_APP_STEPZEN_API_KEY}`,
    },
    uri: REACT_APP_STEPZEN_URI,
})

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
