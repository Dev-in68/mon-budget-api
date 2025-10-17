import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/utils/auth";
import Protected from "@/Pages/Protected";

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
      {/* Les pages sont rendues via Outlet dans AppShell */}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques d'authentification */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Shell protégé avec sous-routes */}
          <Route
            path="/"
            element={
              <Protected>
                <ShellWrapper />
              </Protected>
            }
          >
            <Route index element={<DashboardPage year={2024} month={10} />} />
            <Route path="revenus" element={<RevenusPage />} />
            <Route path="depenses" element={<DepensesPage />} />
            <Route path="password" element={<ChangePasswordPage />} />
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
