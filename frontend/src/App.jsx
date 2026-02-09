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
  if (loading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center"><div>Loading...</div></div>;
  return token ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-bg text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo/:id" element={<Demo />} />
            
            {/* Authentication Pages */}
            <Route path="/enterprise/access" element={<EnterpriseAccess />} />
            <Route path="/student/access" element={<StudentAccess />} />
            
            {/* Protected Routes - Require Authentication */}
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
