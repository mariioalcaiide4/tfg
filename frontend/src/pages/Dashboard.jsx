import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    getMiPerfil, 
    getMisReservas, 
    cancelarReserva, 
    obtenerClases, 
    obtenerUsuarios 
} from '../services/api'; 

// --- CONSTANTES DE ESTILO NEÓN ---
const NEON_GREEN = '#00ff6a';
const NEON_RED = '#ff003c'; // Para cancelaciones o errores
const DARK_BG = '#121212';
const CARD_BG = '#000000';
const TEXT_WHITE = '#ffffff';

const Dashboard = () => {
  const { user } = useAuth();
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [misReservas, setMisReservas] = useState([]);
  const [clases, setClases] = useState([]);      // Para tener los detalles (nombre, hora)
  const [usuarios, setUsuarios] = useState([]);  // Para saber el nombre del monitor
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        // Cargamos TODO en paralelo para que sea rápido
        const [perfilData, reservasData, clasesData, usuariosData] = await Promise.all([
            getMiPerfil(),
            getMisReservas(),
            obtenerClases(),
            obtenerUsuarios()
        ]);

        setDatosPerfil(perfilData);
        setMisReservas(reservasData);
        setClases(clasesData);
        setUsuarios(usuariosData);

      } catch (err) {
        console.error(err);
        setError("Error conectando con el backend");
      } finally {
        setLoading(false);
      }
    };

    if (user) cargarTodo();
  }, [user]);

  // --- HELPERS (Iguales que en Reservar) ---
  const getDetalleClase = (claseId) => {
      return clases.find(c => c.id === claseId) || {};
  };

  const getNombreEntrenador = (id) => {
      if (!usuarios.length || !id) return "Desconocido";
      const entrenador = usuarios.find(u => u.id === id);
      return entrenador ? entrenador.nombre : "Desconocido";
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Fecha no disponible";
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  // --- ACCIONES ---
  const handleCancelar = async (idReserva) => {
    if (!window.confirm("¿Seguro que quieres cancelar esta clase?")) return;

    try {
      const reservaActualizada = await cancelarReserva(idReserva);
      
      // Actualizamos la lista localmente
      setMisReservas(prev => 
        prev.map(r => r.id === idReserva ? { ...r, estado: 'CANCELADA' } : r)
      );
      
      alert("🗑️ Reserva cancelada correctamente");
    } catch (error) {
      alert("❌ Error al cancelar");
    }
  };

  const handleEditField = (campo) => {
      // Aquí iría la lógica para abrir un modal o input
      alert(`Editar ${campo} (Funcionalidad pendiente de implementar)`);
  };

  // --- ESTILOS INLINE ---
  const containerStyle = {
      backgroundColor: DARK_BG,
      minHeight: 'calc(100vh - 64px)',
      padding: '30px',
      paddingTop: '80px', // Espacio para el Navbar
      color: TEXT_WHITE
  };

  const profileRowStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom: '1px solid #333'
  };

  const editButtonStyle = {
      background: 'transparent',
      border: `1px solid ${NEON_GREEN}`,
      color: NEON_GREEN,
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px'
  };

  if (loading || !user) return <div style={{...containerStyle, textAlign:'center'}}>Cargando Dashboard...</div>;

  return (
    <div style={containerStyle}>
      <h1 style={{ 
          textAlign: "center", marginBottom: "40px", color: NEON_GREEN,
          textTransform: 'uppercase', letterSpacing: '2px',
          textShadow: `0 0 10px ${NEON_GREEN}` 
      }}>
        Mi Cuenta
      </h1>
      
      {error && <p style={{ color: NEON_RED, textAlign: 'center' }}>{error}</p>}

      {/* --- SECCIÓN 1: DATOS DE PERFIL --- */}
      {datosPerfil && (
        <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto 50px auto', 
            background: CARD_BG, 
            padding: '30px', 
            borderRadius: '16px',
            border: `1px solid ${NEON_GREEN}`,
            boxShadow: `0 0 15px ${NEON_GREEN}20`
        }}>
          <h2 style={{ color: NEON_GREEN, borderBottom: `2px solid ${NEON_GREEN}`, paddingBottom: '10px', marginBottom: '20px' }}>
              Datos Personales
          </h2>

          {/* Campo: Nombre */}
          <div style={profileRowStyle}>
              <div>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>Nombre Completo</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{datosPerfil.nombre}</div>
              </div>
              <button onClick={() => handleEditField('nombre')} style={editButtonStyle}>✏️</button>
          </div>

          {/* Campo: Email */}
          <div style={profileRowStyle}>
              <div>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>Correo Electrónico</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{datosPerfil.email}</div>
              </div>
              <button onClick={() => handleEditField('email')} style={editButtonStyle}>✏️</button>
          </div>

          {/* Campo: Rol (Normalmente no editable, pero ponemos el icono si quieres) */}
          <div style={{ ...profileRowStyle, borderBottom: 'none' }}>
              <div>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>Tipo de Usuario</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: NEON_GREEN }}>{datosPerfil.rol}</div>
              </div>
             {/* Sin botón de editar para el rol por seguridad */}
          </div>
        </div>
      )}

      {/* --- SECCIÓN 2: LISTA DE RESERVAS --- */}
      <h2 style={{ color: NEON_GREEN, marginLeft: '10px', marginBottom: '20px', textAlign: "center" }}>
          MIS RESERVAS ACTIVAS
      </h2>
      
      {misReservas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #333', borderRadius: '10px' }}>
            <p>No tienes reservas todavía.</p>
        </div>
      ) : (
        <div style={{ 
            display: "grid", 
            gap: "25px", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" 
        }}>
          {misReservas.map((reserva) => {
            // Buscamos los detalles reales de la clase usando el ID
            const claseDetalle = getDetalleClase(reserva.claseId);
            const esCancelada = reserva.estado === 'CANCELADA';
            
            // Color de borde y sombra depende del estado
            const borderColor = esCancelada ? NEON_RED : NEON_GREEN;

            return (
                <div key={reserva.id} style={{ 
                    border: `1px solid ${borderColor}`,
                    borderRadius: "16px",
                    padding: "25px",
                    background: CARD_BG,
                    boxShadow: `0 0 10px ${borderColor}40`,
                    color: TEXT_WHITE,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    opacity: esCancelada ? 0.7 : 1
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h4 style={{ margin: "0 0 10px 0", color: borderColor, fontSize: '1.3rem' }}>
                            {claseDetalle.nombre || `Clase #${reserva.claseId}`}
                        </h4>
                        <span style={{ 
                            fontSize: '0.8rem', 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            border: `1px solid ${borderColor}`,
                            color: borderColor
                        }}>
                            {reserva.estado}
                        </span>
                    </div>

                    <p style={{ margin: "5px 0", color: "#bbb" }}>
                         <strong>Fecha:</strong> {formatearFecha(claseDetalle.fechaInicio)}
                    </p>
                    <p style={{ margin: "5px 0", color: "#bbb" }}>
                         <strong>Monitor:</strong> {getNombreEntrenador(claseDetalle.entrenadorId)}
                    </p>
                  </div>

                  {!esCancelada && (
                      <button 
                        onClick={() => handleCancelar(reserva.id)}
                        style={{
                            marginTop: "20px",
                            background: "transparent",
                            color: NEON_RED,
                            border: `1px solid ${NEON_RED}`,
                            padding: "10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "0.3s",
                            width: "100%"
                        }}
                        onMouseOver={(e) => { e.target.style.background = NEON_RED; e.target.style.color = "white"; }}
                        onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = NEON_RED; }}
                      >
                        CANCELAR ASISTENCIA
                      </button>
                  )}
                  
                  {esCancelada && (
                      <div style={{ marginTop: '20px', textAlign: 'center', color: NEON_RED, fontWeight: 'bold' }}>
                          🚫 CANCELADA
                      </div>
                  )}
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;