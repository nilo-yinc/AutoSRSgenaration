import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Wizard from './pages/Wizard';
import Demo from './pages/Demo';
import EnterpriseAccess from './pages/EnterpriseAccess';
import StudentAccess from './pages/StudentAccess';
import EnterpriseForm from './pages/EnterpriseForm';
import EnterpriseGeneration from './pages/EnterpriseGeneration';
import LandingPage from './pages/Landing';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-bg text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/demo/:id" element={<Demo />} />
            <Route path="/enterprise/access" element={<EnterpriseAccess />} />
            <Route path="/student/access" element={<StudentAccess />} />
            <Route path="/enterprise/form" element={
              <PrivateRoute>
                <EnterpriseForm />
              </PrivateRoute>
            } />
            <Route path="/enterprise/generation" element={
              <PrivateRoute>
                <EnterpriseGeneration />
              </PrivateRoute>
            } />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/" element={<LandingPage />} />
            <Route path="/wizard" element={
              <PrivateRoute>
                <Wizard />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
