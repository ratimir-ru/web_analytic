import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./components/ThemeProvider";
import { Layout } from "./components/Layout";
import { Login } from "./components/pages/Login";
import { Home } from "./components/pages/Home";
import { Overview } from "./components/pages/Dashboard";
import { Finance } from "./components/pages/Finance";
import { Sales } from "./components/pages/Sales";
import { Delivery } from "./components/pages/Delivery";
import { Tasks } from "./components/pages/Tasks";
import { Instructions } from "./components/pages/Instructions";
import { Assistant } from "./components/pages/Assistant";
import { Reports } from "./components/pages/Reports";
import { OperativeReport } from "./components/pages/OperativeReport";
import { Profile } from "./components/pages/Profile";
import { Frs } from "./components/pages/Frs";
import { StockBlock } from "./components/pages/Stock";

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState("Иванов Иван");

  const handleLogin = (username: string) => {
    setUserName(username);
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
    setUserName("Иванов Иван");
  };

  if (!authed) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route
            element={<Layout onLogout={handleLogout} userName={userName} />}
          >
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/stock" element={<StockBlock />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/operative-report" element={<OperativeReport />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/frs" element={<Frs />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}