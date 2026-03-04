import { createBrowserRouter } from "react-router";
import { AuthBootstrap } from "./components/auth/AuthBootstrap";
import { GuestOnly } from "./components/auth/GuestOnly";
import { ProtectedLayout } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { Dashboard } from "./pages/Dashboard";
import { Ingresos } from "./pages/ingresos/Ingresos";
import { Gastos } from "./pages/Gastos";
import { Configuracion } from "./pages/Configuracion";
import { Inversiones } from "./pages/Inversiones";
import { Dolar } from "./pages/Dolar";

export const router = createBrowserRouter([
  {
    Component: AuthBootstrap,
    children: [
      {
        Component: GuestOnly,
        children: [
          { path: "/login", Component: LoginPage },
          { path: "/register", Component: RegisterPage },
        ],
      },
      {
        path: "/",
        Component: ProtectedLayout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: "dolar",
            Component: Dolar,
          },
          {
            path: "inversiones",
            Component: Inversiones,
          },
          {
            path: "ingresos",
            Component: Ingresos,
          },
          {
            path: "gastos",
            Component: Gastos,
          },
          {
            path: "configuracion",
            Component: Configuracion,
          },
        ],
      },
    ],
  },
]);
