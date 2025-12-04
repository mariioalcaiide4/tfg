import React, { useState, useEffect } from 'react';
import { crearReserva, obtenerClases, obtenerUsuarios, getMiPerfil } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// --- CONSTANTES DE COLOR PARA EL TEMA NEÓN ---
const NEON_GREEN = '#00ff6a';
const DARK_BG = '#121212';   // Un gris muy oscuro para el fondo principal
const CARD_BG = '#000000';   // Negro puro para las tarjetas
const TEXT_WHITE = '#ffffff';
// ---------------------------------------------

const Reservar = () => {
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clasesData, usuariosData] = await Promise.all([
            obtenerClases(),
            obtenerUsuarios()
        ]);

        setClases(clasesData);
        setUsuarios(usuariosData);
      if (user) {
            try {
                const perfil = await getMiPerfil();
                setUserRole(perfil.rol);
            } catch (err) {
                console.error("Error cargando perfil", err);
            }
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const getNombreEntrenador = (id) => {
      if (!usuarios.length) return "Cargando...";
      const entrenador = usuarios.find(u => u.id === id);
      return entrenador ? entrenador.nombre : "Entrenador Desconocido";
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Hora no disponible";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  const handleReservar = async (clase) => {
    if (!window.confirm(`¿Quieres apuntarte a ${clase.nombre}?`)) return;

    try {
      setLoadingId(clase.id);
      await crearReserva(clase.id);
      alert("✅ ¡Apuntado con éxito!");
      navigate('/dashboard'); 
    } catch (error) {
      console.error(error);
      alert("❌ Error al reservar. Inténtalo de nuevo.");
    } finally {
      setLoadingId(null);
    }
  };

  // Estilo para el contenedor principal para asegurar fondo oscuro
  const mainContainerStyle = {
    backgroundColor: DARK_BG,
    // Usamos 'calc' para restar la altura aprox del toolbar (64px) y evitar doble scroll
    minHeight: 'calc(100vh - 64px)', 
    padding: '30px',
    // IMPORTANTE: Añadimos espacio arriba para que el título no quede tapado por el Navbar
    paddingTop: '80px', 
    color: TEXT_WHITE,
    // Opcional: Para que el fondo oscuro cubra todo si el navbar es fixed
    marginTop: '0px' 
  };

  if (loadingData) {
    return <div style={{ ...mainContainerStyle, textAlign: 'center', paddingTop: '150px' }}>Cargando clases...</div>;
  }

  return (
    <div style={mainContainerStyle}>
      <br></br>
      {clases.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>No hay clases disponibles en este momento.</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "25px" 
        }}>
          {clases.map((clase) => (
            <div key={clase.id} style={{ 
              // --- ESTILOS DE LA TARJETA FUTURISTA ---
              border: `1px solid ${NEON_GREEN}`, // Borde fino neón
              borderRadius: "16px",
              padding: "25px",
              background: CARD_BG, // Fondo negro
              // Sombra exterior simulando resplandor neón (el '40' al final es transparencia hex)
              boxShadow: `0 0 15px ${NEON_GREEN}40`, 
              color: TEXT_WHITE,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              // Un pequeño truco para que al pasar el mouse resplandezca más (requiere CSS externo, pero esto ayuda)
              cursor: 'default'
            }}>
              <div>
                <h3 style={{ 
                    margin: "0 0 15px 0", 
                    color: NEON_GREEN, // Nombre de la clase en neón
                    fontSize: '1.5rem',
                    textShadow: `0 0 5px ${NEON_GREEN}80`
                }}>
                    {clase.nombre}
                </h3>
                {/* Los textos ahora son blancos (heredado del padre) en vez de gris #666 */}
                <p style={{ margin: "8px 0", fontSize: '1.1rem' }}>
                     <strong style={{color: NEON_GREEN}}>Hora:</strong> {formatearFecha(clase.fechaInicio)}
                </p>
                <p style={{ margin: "8px 0", fontSize: '1.1rem' }}>
                     <strong style={{color: NEON_GREEN}}>Monitor:</strong> {getNombreEntrenador(clase.entrenadorId)}
                </p>
                <p style={{ margin: "8px 0", fontSize: '1.1rem' }}>
                     <strong style={{color: NEON_GREEN}}>Plazas:</strong> {clase.capacidadMaxima}
                </p>
              </div>

              {userRole !== 'ENTRENADOR' && (
                <button 
                  onClick={() => handleReservar(clase)}
                  disabled={loadingId === clase.id}
                  style={{
                    marginTop: "25px",
                    padding: "15px",
                    // Si carga: gris oscuro. Si no: Verde Neón.
                    background: loadingId === clase.id ? "#333" : NEON_GREEN, 
                    // Texto negro sobre fondo neón para máximo contraste
                    color: loadingId === clase.id ? "#888" : "black", 
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "900", // Extra negrita
                    textTransform: "uppercase",
                    cursor: loadingId === clase.id ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease-in-out",
                    // Resplandor en el botón también
                    boxShadow: loadingId === clase.id ? "none" : `0 0 15px ${NEON_GREEN}80`
                  }}
                >
                  {loadingId === clase.id ? "Reservando..." : "Reservar Ahora"}
                </button>
              )}


              <button
                  variant="contained"
                  size="small"
                  color="secondary"
                  style={{
                  marginTop: "25px",
                  padding: "15px",
                  // Si carga: gris oscuro. Si no: Verde Neón.
                  background: loadingId === clase.id ? "#333" : "#FFFFFF", 
                  // Texto negro sobre fondo neón para máximo contraste
                  color: loadingId === clase.id ? "#888" : "black", 
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "900", // Extra negrita
                  textTransform: "uppercase",
                  cursor: loadingId === clase.id ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease-in-out",
                  // Resplandor en el botón también
                  boxShadow: loadingId === clase.id ? "none" : `0 0 15px ${NEON_GREEN}80`
                }}
                  endIcon={<ChevronRightIcon />}
                  fullWidth
                  onClick={() => navigate(`/clases/${clase.id}`)}
                >
                  {"Ver detalles..."}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservar;