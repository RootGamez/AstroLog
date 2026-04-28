import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Astrolog from './pages/Astrolog';
import MarsExplorer from './pages/MarsExplorer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

function AppRoutes() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
      <Route
        path="/login"
        element={(
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/register"
        element={(
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/home"
        element={(
          <ProtectedRoute>
            <Home onSelectFeature={(feature) => navigate(feature === 'astrolog' ? '/astrolog' : '/mars')} />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/astrolog"
        element={(
          <ProtectedRoute>
            <Astrolog onBack={() => navigate('/home')} />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/mars"
        element={(
          <ProtectedRoute>
            <MarsExplorer />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
