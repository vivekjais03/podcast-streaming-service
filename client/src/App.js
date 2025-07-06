import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeWithLayout from "./pages/HomeWithLayout";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Home Page (Protected so only logged-in can explore) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeWithLayout page="home" />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomeWithLayout page="dashboard" />
            </ProtectedRoute>
          }
        />

        {/* Upload */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <HomeWithLayout page="upload" />
            </ProtectedRoute>
          }
        />

        {/* Search */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <HomeWithLayout page="search" />
            </ProtectedRoute>
          }
        />

        {/* Favourites */}
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <HomeWithLayout page="favourites" />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </Router>
  );
}

export default App;
