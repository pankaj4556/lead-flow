import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import BookAppointment from './pages/BookAppointment';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsappButton from './components/WhatsappButton';

// Main Layout Wrapper to conditionally render headers/footers
const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show header/nav only on public pages */}
      {!isAdminDashboard && <Navbar />}

      {/* Main viewport */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>

      {/* Floating Whatsapp widget only on public pages */}
      {!isAdminDashboard && <WhatsappButton />}

      {/* Show footer only on public pages */}
      {!isAdminDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
