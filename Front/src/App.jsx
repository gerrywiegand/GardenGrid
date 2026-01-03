import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Plants from "./pages/Plants";
import ProtectedRoute from "./auth/ProtectedRoute";
import Gardens from "./pages/Gardens";
import GardenDetail from "./pages/GardenDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plants"
        element={
          <ProtectedRoute>
            <Plants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gardens"
        element={
          <ProtectedRoute>
            <Gardens />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gardens/:id"
        element={
          <ProtectedRoute>
            <GardenDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
