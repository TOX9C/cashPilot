import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./utils/protectedRoute.jsx";
import Register from "./pages/Register.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transactions from "./pages/Transactions.jsx";
import Goals from "./pages/Goals.jsx";
import Options from "./pages/Options.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accounts",
    element: (
      <ProtectedRoute>
        <Accounts />{" "}
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions",
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/goals",
    element: (
      <ProtectedRoute>
        {" "}
        <Goals />{" "}
      </ProtectedRoute>
    ),
  },
  {
    path: "/options",
    element: (
      <ProtectedRoute>
        <Options />{" "}
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
