import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/index.css";
import LoginPage from "./Pages/LoginPage";
import Protected from "./Pages/Protected";
import PasswordPage from "./Pages/PasswordPage";
import BudgetApp from "./features/Budget/BudgetApp";
import { AuthProvider } from "./utils/auth";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/account/password",
    element: (
      <Protected>
        <PasswordPage />
      </Protected>
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <BudgetApp />
      </Protected>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
