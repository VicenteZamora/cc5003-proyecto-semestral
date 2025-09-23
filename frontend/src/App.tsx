import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuideComponent from "./components/GuideComponent";
import GameInfo from "./pages/GameInfo";
import GamesList from "./pages/GamesList";
import { NotFound } from "./pages/NotFound";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<GamesList />} />
        <Route path="/games/:id" element={<GameInfo />} />
        <Route path="/games/:id/guides/:guideId" element={<GuideComponent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
