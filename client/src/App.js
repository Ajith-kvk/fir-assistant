import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import NewFIRPage from "./pages/NewFIRPage";
import FIRHistoryPage from "./pages/FIRHistoryPage";
import FIRDetailPage from "./pages/FIRDetailPage";
import RightsPage from "./pages/RightsPage";
import PoliceFinderPage from "./pages/PoliceFinderPage";
import LegalChatPage from "./pages/LegalChatPage";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/fir/new" element={<PrivateRoute><NewFIRPage /></PrivateRoute>} />
          <Route path="/fir/history" element={<PrivateRoute><FIRHistoryPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/fir/:id" element={<PrivateRoute><FIRDetailPage /></PrivateRoute>} />
          <Route path="/rights" element={<PrivateRoute><RightsPage /></PrivateRoute>} />
          <Route path="/police-finder" element={<PrivateRoute><PoliceFinderPage /></PrivateRoute>} />
          <Route path="/legal-chat" element={<PrivateRoute><LegalChatPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;