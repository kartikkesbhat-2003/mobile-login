import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LoginPage from './components/LoginPage';
import OtpPage from './components/OtpPage';
import { Toaster } from './components/ui/sonner';

function App() {

  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
