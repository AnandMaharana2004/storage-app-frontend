import { useState } from "react";
import LandingPage from "./components/pages/landingPage";
import LoginPage from "./components/pages/loginPage";
import RegisterPage from "./components/pages/registerPage";
import DashboardPage from "./components/pages/dashboardPage";
import SettingsPage from "./components/pages/settingPage";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
