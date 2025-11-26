import React, { useState } from 'react';
import { crearReserva } from '../services/api';
import { useNavigate } from 'react-router-dom';

// DATOS FALSOS (MOCK) PARA SALIR DEL PASO RÁPIDO
// (En el futuro esto vendría de tu microservicio de Clases)
const CLASES_DISPONIBLES = [
  { id: 1, nombre: "Crossfit Iniciación", hora: "10:00", monitor: "Manuel Leñero", plazas: 15 },
  { id: 2, nombre: "Yoga Relax", hora: "11:30", monitor: "Ana Zen", plazas: 20 },
  { id: 3, nombre: "Boxeo", hora: "17:00", monitor: "Rocky B.", plazas: 10 },
  { id: 4, nombre: "Pilates", hora: "18:30", monitor: "Laura Estira", plazas: 12 },
  { id: 5, nombre: "Zumba", hora: "19:30", monitor: "Beto Pérez", plazas: 25 },
  { id: 6, nombre: "Halterofilia", hora: "20:30", monitor: "Hércules", plazas: 8 },
];

const Reservar = () => {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null); // Para saber qué botón está cargando

  const handleReservar = async (clase) => {
    if (!window.confirm(`¿Quieres apuntarte a ${clase.nombre}?`)) return;

    try {
      setLoadingId(clase.id); // Ponemos el botón cargando
      
      // LLAMADA REAL A TU BACKEND
      await crearReserva(clase.id);
      
      alert("✅ ¡Apuntado con éxito!");
      navigate('/dashboard'); // Te llevamos al dashboard para que veas tu reserva
      
    } catch (error) {
      console.error(error);
      alert("❌ Error al reservar. ¿Quizás el backend de Reservas está apagado?");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Clases Disponibles Hoy</h1>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "20px" 
      }}>
        {CLASES_DISPONIBLES.map((clase) => (
          <div key={clase.id} style={{ 
            border: "1px solid #e0e0e0", 
            borderRadius: "12px", 
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{clase.nombre}</h3>
              <p style={{ margin: "5px 0", color: "#666" }}>🕒 <strong>Hora:</strong> {clase.hora}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>🏋️ <strong>Monitor:</strong> {clase.monitor}</p>
              <p style={{ margin: "5px 0", color: "#666" }}>👥 <strong>Plazas:</strong> {clase.plazas}</p>
            </div>

            <button 
              onClick={() => handleReservar(clase)}
              disabled={loadingId === clase.id}
              style={{
                marginTop: "15px",
                padding: "12px",
                background: loadingId === clase.id ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: loadingId === clase.id ? "not-allowed" : "pointer",
                transition: "background 0.3s"
              }}
            >
              {loadingId === clase.id ? "Reservando..." : "Reservar Ahora"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservar;