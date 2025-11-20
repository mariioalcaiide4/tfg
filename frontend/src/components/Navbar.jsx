import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ¡Mira qué fácil usamos el contexto!

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '20px' }}>
      <Link to="/">Home</Link>
      
      {/* Si hay usuario mostramos Dashboard y Logout, si no, Login */}
      {user ? (
        <>
          <Link to="/dashboard">Mis Clases</Link>
          <Link to="/reservar">Reservar</Link>
          <button onClick={logout}>Salir</button>
          <span>(Hola, {user.uid.substring(0,5)}...)</span>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;