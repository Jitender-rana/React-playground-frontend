import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        {/* Catch-all route to redirect unknown paths to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
