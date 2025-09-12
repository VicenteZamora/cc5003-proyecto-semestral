import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuideComponent from "./components/GuideComponent";
import GameInfo from "./pages/GameInfo";
import GamesList from "./pages/GamesList";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<GamesList />} />
        <Route path="/games/:id" element={<GameInfo />} />
        <Route path="/guides/:id" element={<GuideComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
