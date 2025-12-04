import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Importamos useNavigate
import { useAuth } from '../context/AuthContext';
import { 
    getMiPerfil, 
    getMisReservas, 
    cancelarReserva, 
    obtenerClases, 
    obtenerUsuarios,
    deleteClase,
    updateUsuario
} from '../services/api'; 

// --- CONSTANTES DE ESTILO NEÓN ---
const NEON_GREEN = '#00ff6a';
const NEON_RED = '#ff003c'; 
const NEON_WHITE = '#ffffff'; // <--- Nuevo color para el botón solicitado
const DARK_BG = '#121212';
const CARD_BG = '#000000';
const TEXT_WHITE = '#ffffff';
const INPUT_BG = '#1e1e1e'; // <-- ¡AÑADE ESTA LÍNEA!

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // <--- 2. Hook de navegación
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [misReservas, setMisReservas] = useState([]);
  const [clases, setClases] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [perfilData, reservasData, clasesData, usuariosData] = await Promise.all([
            getMiPerfil(),
            getMisReservas(),
            obtenerClases(),
            obtenerUsuarios()
        ]);

        setDatosPerfil(perfilData);
        setEditFormData(perfilData);
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

  const handleProfileChange = (e) => {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
      try {
          // 1. Limpiamos la fecha si es necesario y nos aseguramos de que sea YYYY-MM-DD
          let fechaNac = editFormData.fechaNacimiento;
          if (fechaNac && fechaNac.includes('T')) {
             fechaNac = fechaNac.split('T')[0];
          }

          // 2. CONSTRUCCIÓN DEL OBJETO DE ENVÍO (Solo enviamos campos editables)
          const dataToSend = {
             nombre: editFormData.nombre,
             apellido: editFormData.apellido,
             telefono: editFormData.telefono,
             direccion: editFormData.direccion,
             fechaNacimiento: editFormData.fechaNacimiento?.split('T')[0] || '',             // NO ENVIAMOS: id, rol, email, firebaseUid (son inmutables o se gestionan aparte)
          };
          
          const userId = datosPerfil.id;

          // 3. LLAMADA API
          const updatedUser = await updateUsuario(userId, dataToSend);
          
          // El backend debería devolver el objeto completo actualizado, incluyendo campos no enviados (como email, rol, etc.)
          setDatosPerfil(updatedUser); 
          setEditFormData(updatedUser);
          setIsEditingProfile(false);
          alert("✅ Perfil actualizado correctamente");

      } catch (error) {
          console.error("❌ Error en handleSaveProfile:", error);
          // Si el servidor falla (ej: 500, 400), alertamos el error genérico.
          alert("❌ Error al actualizar el perfil. Revisa la consola para más detalles.");
      }
  };
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
  
  // 3. Función para navegar a los detalles
  const handleVerDetalles = (claseId) => {
      navigate(`/clases/${claseId}`);
  };

  const handleCancelar = async (idReserva) => {
    if (!window.confirm("¿Seguro que quieres cancelar esta clase?")) return;

    try {
      await cancelarReserva(idReserva);
      setMisReservas(prev => 
        prev.map(r => r.id === idReserva ? { ...r, estado: 'CANCELADA' } : r)
      );
      alert("🗑️ Reserva cancelada correctamente");
    } catch (error) {
      alert("❌ Error al cancelar");
    }
  };

  const handleBorrarClase = async (claseId) => {
    if (!window.confirm("¿⚠️ ESTÁS SEGURO? Esto eliminará la clase y todas sus reservas.")) return;

    try {
      // Asumimos que existe deleteClase en tu API. Si no, créalo.
      await deleteClase(claseId); 
      
      // Actualizamos la lista local borrando la clase
      setClases(prev => prev.filter(c => c.id !== claseId));
      alert("✅ Clase eliminada correctamente");
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar la clase (comprueba que no tenga reservas activas o que el backend lo permita)");
    }
  };

  // --- ESTILOS INLINE ---
  const containerStyle = {
      backgroundColor: DARK_BG,
      minHeight: 'calc(100vh - 64px)',
      padding: '30px',
      paddingTop: '80px',
      color: TEXT_WHITE
  };

  const profileRowStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom: '1px solid #333'
  };

  const inputStyle = {
      background: INPUT_BG,
      border: `1px solid ${NEON_GREEN}`,
      color: TEXT_WHITE,
      padding: '8px',
      borderRadius: '5px',
      width: '60%', // Ocupa un poco más de la mitad
      textAlign: 'right',
      fontFamily: 'monospace'
  };

const btnWhiteNeon = {
      background: "transparent",
      color: NEON_WHITE,
      border: `1px solid ${NEON_WHITE}`,
      padding: "12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
      transition: "all 0.3s ease",
      boxShadow: `0 0 5px ${NEON_WHITE}40`,
      width: "100%"
  };

  const btnRedNeon = {
      background: "transparent",
      color: NEON_RED,
      border: `1px solid ${NEON_RED}`,
      padding: "10px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
      width: "100%",
      fontSize: "0.9rem",
      textTransform: "uppercase"
  };

  if (loading || !user) return <div style={{...containerStyle, textAlign:'center'}}>Cargando Dashboard...</div>;

  const esEntrenador = datosPerfil?.rol === 'ENTRENADOR';
  let listaItems = [];
  if (esEntrenador) {
      listaItems = clases.filter(c => c.entrenadorId == datosPerfil?.id);
  } else {
      listaItems = misReservas;
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: NEON_GREEN, textTransform: 'uppercase', letterSpacing: '2px', textShadow: `0 0 10px ${NEON_GREEN}` }}>
        Mi Cuenta
      </h1>
      
      {error && <p style={{ color: NEON_RED, textAlign: 'center' }}>{error}</p>}

      {/* --- SECCIÓN 1: DATOS DE PERFIL (CON EDICIÓN) --- */}
      {datosPerfil && (
        <div style={{ maxWidth: '800px', margin: '0 auto 50px auto', background: CARD_BG, padding: '30px', borderRadius: '16px', border: `1px solid ${NEON_GREEN}`, boxShadow: `0 0 15px ${NEON_GREEN}20` }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `2px solid ${NEON_GREEN}`, paddingBottom: '10px' }}>
              <h2 style={{ color: NEON_GREEN, margin: 0 }}>Datos Personales</h2>
              {!isEditingProfile && (
                  <button 
                      onClick={() => setIsEditingProfile(true)}
                      style={{ background: 'transparent', border: `1px solid ${NEON_GREEN}`, color: NEON_GREEN, padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                      EDITAR PERFIL 
                  </button>
              )}
          </div>

          <div style={profileRowStyle}>
              <span style={{ color: '#888' }}>Nombre</span>
              {isEditingProfile ? <input name="nombre" value={editFormData.nombre} onChange={handleProfileChange} style={inputStyle} /> : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{datosPerfil.nombre}</span>}
          </div>

          <div style={profileRowStyle}>
              <span style={{ color: '#888' }}>Apellido</span>
              {isEditingProfile ? <input name="apellido" value={editFormData.apellido} onChange={handleProfileChange} style={inputStyle} /> : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{datosPerfil.apellido}</span>}
          </div>

          <div style={profileRowStyle}>
              <span style={{ color: '#888' }}>Fecha Nacimiento</span>
              {isEditingProfile ? <input type="date" name="fechaNacimiento" value={editFormData.fechaNacimiento} onChange={handleProfileChange} style={inputStyle} /> : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{datosPerfil.fechaNacimiento}</span>}
          </div>

          <div style={profileRowStyle}>
              <span style={{ color: '#888' }}>Dirección</span>
              {isEditingProfile ? <input name="direccion" value={editFormData.direccion} onChange={handleProfileChange} style={inputStyle} /> : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{datosPerfil.direccion}</span>}
          </div>

          <div style={profileRowStyle}>
              <span style={{ color: '#888' }}>Teléfono</span>
              {isEditingProfile ? <input name="telefono" value={editFormData.telefono} onChange={handleProfileChange} style={inputStyle} /> : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{datosPerfil.telefono}</span>}
          </div>

          {/* Email y Rol suelen ser de solo lectura o requieren procesos especiales */}
          <div style={profileRowStyle}>
              <span style={{ color: '#888' }}>Email</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#aaa' }}>{datosPerfil.email}</span>
          </div>

          <div style={{ ...profileRowStyle, borderBottom: 'none' }}>
              <span style={{ color: '#888' }}>Tipo de Usuario</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: NEON_GREEN }}>{datosPerfil.rol}</span>
          </div>

          {/* BOTONES DE GUARDAR/CANCELAR PERFIL */}
          {isEditingProfile && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={handleSaveProfile} style={{ flex: 1, background: NEON_GREEN, border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>GUARDAR</button>
                <button onClick={() => { setIsEditingProfile(false); setEditFormData(datosPerfil); }} style={{ flex: 1, background: '#333', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>CANCELAR</button>
            </div>
          )}

        </div>
      )}

      {/* --- SECCIÓN 2: LISTA (CLASES O RESERVAS) --- */}
      <h2 style={{ color: NEON_GREEN, marginLeft: '10px', marginBottom: '20px', textAlign: "center" }}>
          {esEntrenador ? 'MIS CLASES (IMPARTIDAS)' : 'MIS RESERVAS ACTIVAS'}
      </h2>
      
      {/* ... (Esta parte de la lista sigue igual que antes) ... */}
      {listaItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #333', borderRadius: '10px' }}>
            <p>{esEntrenador ? "No has creado ninguna clase todavía." : "No tienes reservas activas."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "25px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {listaItems.map((item) => {
            let claseObj = esEntrenador ? item : getDetalleClase(item.claseId);
            let estado = esEntrenador ? (item.activa ? 'ACTIVA' : 'INACTIVA') : item.estado;
            let esCancelada = !esEntrenador && estado === 'CANCELADA';
            let borderColor = esCancelada ? NEON_RED : NEON_GREEN;
            let keyId = esEntrenador ? item.id : item.id; 

            return (
                <div key={keyId} style={{ border: `1px solid ${borderColor}`, borderRadius: "16px", padding: "25px", background: CARD_BG, boxShadow: `0 0 10px ${borderColor}40`, color: TEXT_WHITE, display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: esCancelada ? 0.7 : 1 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h4 style={{ margin: "0 0 10px 0", color: borderColor, fontSize: '1.3rem' }}>{claseObj.nombre}</h4>
                        <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${borderColor}`, color: borderColor }}>{estado}</span>
                    </div>
                    <p style={{ margin: "5px 0", color: "#bbb" }}><strong>Fecha:</strong> {formatearFecha(claseObj.fechaInicio)}</p>
                    <p style={{ margin: "5px 0", color: "#bbb" }}><strong>Monitor:</strong> {esEntrenador ? "TÚ" : getNombreEntrenador(claseObj.entrenadorId)}</p>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!esCancelada && (
                        <>
                            <button onClick={() => handleVerDetalles(claseObj.id)} style={btnWhiteNeon} onMouseEnter={(e) => { e.target.style.background = NEON_WHITE; e.target.style.color = "black"; e.target.style.boxShadow = `0 0 20px ${NEON_WHITE}, 0 0 40px ${NEON_WHITE}40`; }} onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = NEON_WHITE; e.target.style.boxShadow = `0 0 5px ${NEON_WHITE}40`; }}>Ver Detalles</button>
                            {esEntrenador ? (
                                <button onClick={() => handleBorrarClase(claseObj.id)} style={btnRedNeon} onMouseEnter={(e) => { e.target.style.background = NEON_RED; e.target.style.color = "white"; }} onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = NEON_RED; }}>BORRAR CLASE</button>
                            ) : (
                                <button onClick={() => handleCancelar(item.id)} style={btnRedNeon} onMouseEnter={(e) => { e.target.style.background = NEON_RED; e.target.style.color = "white"; }} onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = NEON_RED; }}>Cancelar Asistencia</button>
                            )}
                        </>
                    )}
                    {esCancelada && <div style={{ marginTop: '20px', textAlign: 'center', color: NEON_RED, fontWeight: 'bold' }}>🚫 CANCELADA</div>}
                  </div>
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;