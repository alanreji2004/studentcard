import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Login from "./pages/Login/Login"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
