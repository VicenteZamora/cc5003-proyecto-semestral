import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import GuideComponent from "./components/GuideComponent";
import GameInfo from "./pages/GameInfo";
import GamesList from "./pages/GamesList";
import { NotFound } from "./pages/NotFound";
import { NavBar } from "./components/NavBar";
import LoginComponent from "./pages/Login";
import RegisterComponent from "./pages/Register";
import './axiosConfig';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<GamesList />} />
          <Route path="/games/:id" element={<GameInfo />} />
          <Route path="/games/:id/guides/:guideId" element={<GuideComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
