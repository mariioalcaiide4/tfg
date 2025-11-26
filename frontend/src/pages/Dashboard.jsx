import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMiPerfil, getMisReservas } from '../services/api'; // <--- Importamos la nueva función

const Dashboard = () => {
  const { user } = useAuth();
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [misReservas, setMisReservas] = useState([]); // <--- Estado para reservas
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        // 1. Cargamos Perfil
        const perfil = await getMiPerfil();
        setDatosPerfil(perfil);

        // 2. Cargamos Reservas
        const reservas = await getMisReservas();
        setMisReservas(reservas);

      } catch (err) {
        console.error(err);
        setError("Error conectando con el backend");
      }
    };

    if (user) cargarTodo();
  }, [user]);

  const handleCancelar = async (idReserva) => {
    if (!window.confirm("¿Seguro que quieres cancelar esta clase?")) return;

    try {
      // 1. Llamamos al backend
      const reservaActualizada = await cancelarReserva(idReserva);
      
      // 2. Actualizamos la lista visualmente (sin recargar F5)
      // Buscamos la reserva en la lista y cambiamos su estado a lo que nos devolvió el backend
      setMisReservas(prevReservas => 
        prevReservas.map(reserva => 
          reserva.id === idReserva ? reservaActualizada : reserva
        )
      );
      
      alert("🗑️ Reserva cancelada correctamente");
      
    } catch (error) {
      alert("❌ Error al cancelar");
    }
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="container">
      <h1>Dashboard de Usuario</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TARJETA DE PERFIL */}
      {datosPerfil && (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "20px", background: "#f9f9f9" }}>
          <h2>👋 Hola, {datosPerfil.nombre}</h2>
          <p><strong>Rol:</strong> {datosPerfil.rol}</p>
          <p><strong>Email:</strong> {datosPerfil.email}</p>
        </div>
      )}

      {/* LISTA DE RESERVAS */}
      <h3>📅 Mis Clases Reservadas</h3>
      
      {misReservas.length === 0 ? (
        <p>No tienes reservas todavía. ¡Apúntate a algo!</p>
      ) : (
        <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
          {misReservas.map((reserva) => (
            <div key={reserva.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", boxShadow: "2px 2px 5px rgba(0,0,0,0.1)" }}>
              <h4>Clase #{reserva.claseId}</h4>
              <p>Estado: <strong>{reserva.estado}</strong></p>
              <small>Reserva ID: {reserva.id}</small>
              {reserva.estado !== 'CANCELADA' && (
                  <button 
                    onClick={() => handleCancelar(reserva.id)}
                    style={{
                        display: "block",
                        marginTop: "10px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                  >
                    Cancelar Reserva
                  </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;