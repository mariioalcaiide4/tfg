import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMiPerfil } from '../services/api'; // Asegúrate de que api.js está bien importado

const Dashboard = () => {
  const { user } = useAuth();
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Función para cargar datos del backend
    const cargarDatos = async () => {
      try {
        // Llamamos al endpoint /api/usuarios/uid/56Ed...
        const datos = await getMiPerfil(); 
        setDatosPerfil(datos);
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el Backend 😢");
      }
    };

    if (user) {
      cargarDatos();
    }
  }, [user]);

  if (!user) return <p>No estás logueado.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard de Usuario</h1>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      {datosPerfil ? (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", maxWidth: "500px" }}>
          <h2>👋 Hola, {datosPerfil.nombre}</h2>
          <p><strong>Email:</strong> {datosPerfil.email}</p>
          <p><strong>Rol:</strong> {datosPerfil.rol}</p>
          <p><strong>Tu ID:</strong> <small>{datosPerfil.firebaseUid}</small></p>
          
          <hr />
          <button style={{ background: "green", color: "white", padding: "10px 20px", border: "none" }}>
            Ver Mis Reservas (Próximamente)
          </button>
        </div>
      ) : (
        <p>Cargando tus datos desde Spring Boot...</p>
      )}
    </div>
  );
};

export default Dashboard;