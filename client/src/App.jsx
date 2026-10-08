import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HospitalSearch from './pages/HospitalSearch';
import DoctorSearch from './pages/DoctorSearch';
import DiseaseSearch from './pages/DiseaseSearch';
import MedicineSearch from './pages/MedicineSearch';
import PharmacySearch from './pages/PharmacySearch';
import Emergency from './pages/Emergency';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Public Healthcare Discovery Routes */}
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="hospitals" element={<HospitalSearch />} />
              <Route path="doctors" element={<DoctorSearch />} />
              <Route path="diseases" element={<DiseaseSearch />} />
              <Route path="medicines" element={<MedicineSearch />} />
              <Route path="pharmacies" element={<PharmacySearch />} />
              <Route path="emergency" element={<Emergency />} />
              
              {/* Protected User Appointment & Dashboard Routes */}
              <Route path="book-appointment/:doctorId" element={<BookAppointment />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
