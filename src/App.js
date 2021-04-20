import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Event from './pages/Event'

function App() {
    return (
        <Router>
            <div className="bg-gray-50 relative flex flex-col max-w-4xl mt-2 mx-auto rounded shadow pb-8">
                <header>
                    <Navbar />
                </header>
                <main className="">
                    <Switch>
                        <Route path="/event/:slug">
                            <Event />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )
}

export default App
