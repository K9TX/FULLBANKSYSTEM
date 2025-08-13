import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import AppLayout from './components/layout/AppLayout';
import DepositPage from './components/pages/DepositPage';
import TransferPage from './components/pages/TransferPage';
import TransactionsPage from './components/pages/TransactionsPage';
import BlogsPage from './components/pages/BlogsPage';
import HomePage from './components/pages/HomePage';
import BalancePage from './components/pages/BalancePage';
import ProfilePage from './components/pages/ProfilePage';
import AboutPage from './components/pages/AboutPage';
import UsersPage from './components/pages/UsersPage';
import LoansPage from './components/pages/LoansPage';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          
          {/* Protected Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="deposit" element={<DepositPage />} />
            <Route path="transfer" element={<TransferPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="balance" element={<BalancePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
