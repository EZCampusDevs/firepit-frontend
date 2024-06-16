import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { LandingPage } from './pages/LandingPage'
import { RoomPage } from './pages/RoomPage.tsx'

import { ThemeProvider } from '@/components/theme-provider'

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route
                        path="/join/:ROOM/"
                        element={<LandingPage />}
                    ></Route>
                    <Route path="/room/:ROOM/" element={<RoomPage />}></Route>
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App
