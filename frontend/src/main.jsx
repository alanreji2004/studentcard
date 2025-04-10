import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Login from "./pages/Login/Login"
import StudentCard from "./pages/StudentCard/StudentCard"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/studentcard/:id",
    element: <StudentCard />,
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
