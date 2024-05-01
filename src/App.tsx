import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { LandingPage } from './components/LandingPage'
import { TestPage } from './components/newpage/TestPage'

import { ThemeProvider } from '@/components/theme-provider'

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="/test" element={<TestPage />}></Route>
                    <Route path="/room/:ROOM/" element={<TestPage />}></Route>
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App
