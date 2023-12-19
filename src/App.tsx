import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { LandingPage } from "./components/LandingPage";

import { ThemeProvider } from "@/components/theme-provider"
import { RoomPage } from "./components/RoomPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/room" element={<RoomPage />}></Route>
        </Routes>
      </Router>
      </ThemeProvider>
      );
}

export default App;
