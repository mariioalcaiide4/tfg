import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <--- IMPORTANTE

// Importa tus páginas (asegúrate de crearlas aunque estén vacías, como te dije antes)
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegisterPage  from './pages/RegisterPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reservar from './pages/Reservar';

function App() {
  return (
    <AuthProvider> {/* <--- ENVOLVEMOS TODO AQUÍ */}
      <Router>
        <Navbar />
        
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservar" element={<Reservar />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;