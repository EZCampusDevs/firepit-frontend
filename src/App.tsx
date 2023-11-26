import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
import { CardDemo } from './components/CardDemo';
import { CardAvatarCreate } from './components/CardAvatarCreate';

import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/landing" element={<CardDemo />}></Route>
          <Route path="/id" element={<CardAvatarCreate />}></Route>
        </Routes>
      </Router>
      </ThemeProvider>
      );
}

export default App;
