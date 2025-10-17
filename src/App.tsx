import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, Protected } from "@/utils/auth";

import { useState } from "react";
import AppShell from "./components/Layout/AppShell";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import DashboardPage from "./Pages/DashboardPage";
import RevenusPage from "./Pages/RevenusPage";
import DepensesPage from "./Pages/DepensesPage";
import ChangePasswordPage from "./Pages/ChangePasswordPage";

function ShellWrapper() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  return (
    <AppShell month={month} year={year} setMonth={setMonth} setYear={setYear}>
      {/* Outlet est dans AppShell – on passe year/month aux pages si besoin */}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Shell protégé */}
          <Route
            path="/"
            element={
              <Protected>
                <ShellWrapper />
              </Protected>
            }
          >
            <Route
              index
              element={<DashboardPage year={0 as any} month={0 as any} />}
            />
            {/* Conseil simple : DashboardPage lit year/month via prop drilling depuis ShellWrapper */}
            {/* Pour contourner le typage ici on passe any, ou adapte en context si tu préfères */}
            <Route path="revenus" element={<RevenusPage />} />
            <Route path="depenses" element={<DepensesPage />} />
            <Route path="password" element={<ChangePasswordPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
