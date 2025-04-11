import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Login from "./pages/Login/Login"
import StudentCard from "./pages/StudentCard/StudentCard"
import ProtectedRoute from "./ProtectedRoute"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/studentcard/:id",
    element:(
      <ProtectedRoute>
        <StudentCard />
      </ProtectedRoute>
    ),
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
