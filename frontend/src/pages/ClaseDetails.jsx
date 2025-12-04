import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { getClaseById, updateClase, getUsuariosPorClase, getMiPerfil } from '../services/api';

// --- ESTÉTICA NEÓN ---
const NEON_GREEN = '#00ff6a';
const NEON_ORANGE = '#00ff6a'; // FALTABA ESTA CONSTANTE
const DARK_BG = '#121212';
const INPUT_BG = '#1e1e1e';
const TEXT_WHITE = '#ffffff';

const ClaseDetails = () => {
  const { id } = useParams(); 
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [clase, setClase] = useState(null);
  const [inscritos, setInscritos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  
  // Estado para saber si soy el dueño real (tras comprobar ID de SQL)
  const [esDuenio, setEsDuenio] = useState(false);

  const [formData, setFormData] = useState({
      nombre: '',
      categoria: '',
      tipo: '',
      fechaInicio: '',
      duracionMin: 0,
      capacidadMaxima: 0
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // 1. Cargamos la CLASE
        const claseData = await getClaseById(id);
        setClase(claseData);
        
        setFormData({
            nombre: claseData.nombre,
            categoria: claseData.categoria,
            tipo: claseData.tipo,
            fechaInicio: claseData.fechaInicio ? claseData.fechaInicio.substring(0, 16) : '', 
            duracionMin: claseData.duracionMin || 60,
            capacidadMaxima: claseData.capacidadMaxima
        });

        // 2. Cargamos MI PERFIL (para saber mi ID SQL y comparar)
        if (user) {
            try {
                const miPerfil = await getMiPerfil();
                
                // COMPROBACIÓN MAESTRA (Usamos '==' para evitar problemas de tipos string/number)
                const soyElJefe = miPerfil.rol === 'ADMIN' || 
                                 (miPerfil.rol === 'ENTRENADOR' && miPerfil.id == claseData.entrenadorId);
                
                setEsDuenio(soyElJefe);
                console.log("¿Es dueño?", soyElJefe);

                // 3. Si soy el jefe, cargamos la lista de asistencia
                if (soyElJefe) {
                    const usuariosData = await getUsuariosPorClase(id);
                    setInscritos(usuariosData);
                }

            } catch (err) {
                console.error("Error comprobando permisos o cargando inscritos", err);
            }
        }

      } catch (error) {
        console.error(error);
        alert("Error al cargar detalles");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) { 
        cargarDatos();
    }
  }, [id, user]);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
      try {
          // Aseguramos formato ISO para la fecha
          const dataToSend = {
            ...clase, 
            ...formData,
             fechaInicio: new Date(formData.fechaInicio).toISOString()
          };

          await updateClase(id, dataToSend);
          alert("✅ Clase actualizada correctamente");
          setIsEditing(false);
          // Recargamos datos visuales
          setClase(dataToSend);
      } catch (error) {
          console.error(error);
          alert("❌ Error al guardar");
      }
  };

  if (loading) return <div style={{ background: DARK_BG, minHeight: '100vh', color: NEON_GREEN, paddingTop: '100px', textAlign: 'center' }}>Cargando...</div>;
  if (!clase) return null;

  // Estilos
  const inputStyle = {
      background: INPUT_BG,
      border: `1px solid ${NEON_GREEN}`,
      color: TEXT_WHITE,
      padding: '10px',
      borderRadius: '5px',
      width: '100%',
      marginBottom: '15px',
      fontFamily: 'monospace'
  };

  const labelStyle = {
      display: 'block',
      color: NEON_GREEN,
      marginBottom: '5px',
      fontSize: '0.9rem',
      textTransform: 'uppercase'
  };

  const valueStyle = {
      color: TEXT_WHITE,
      fontSize: '1.2rem',
      marginBottom: '20px',
      borderBottom: '1px solid #333',
      paddingBottom: '10px'
  };

  return (
    <div style={{ background: DARK_BG, minHeight: 'calc(100vh - 64px)', padding: '40px', paddingTop: '100px', color: TEXT_WHITE }}>

    <br></br>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ 
                color: esDuenio ? NEON_ORANGE : NEON_GREEN, 
                textShadow: `0 0 10px ${esDuenio ? NEON_ORANGE : NEON_GREEN}` 
            }}>
                {isEditing ? 'Editar Clase' : clase.nombre}
            </h1>
            
            {esDuenio && !isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'transparent', border: `1px solid ${NEON_ORANGE}`, color: NEON_ORANGE, padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
                >
                    GESTIONAR
                </button>
            )}
        </div>

        {/* FORMULARIO / VISTA DETALLE */}
        <div style={{ background: '#000', padding: '30px', borderRadius: '15px', border: `1px solid ${esDuenio ? NEON_ORANGE : NEON_GREEN}`, boxShadow: `0 0 20px ${esDuenio ? NEON_ORANGE : NEON_GREEN}20` }}>
            
            {/* NOMBRE */}
            <div>
                <span style={labelStyle}>Nombre de la Clase</span>
                {isEditing ? (
                    <input name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} />
                ) : (
                    <div style={valueStyle}>{clase.nombre}</div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* CATEGORIA */}
                <div>
                    <span style={labelStyle}>Categoría</span>
                    {isEditing ? (
                        <input name="categoria" value={formData.categoria} onChange={handleChange} style={inputStyle} />
                    ) : (
                        <div style={valueStyle}>{clase.categoria}</div>
                    )}
                </div>
                {/* TIPO */}
                <div>
                    <span style={labelStyle}>Tipo / Intensidad</span>
                    {isEditing ? (
                        <input name="tipo" value={formData.tipo} onChange={handleChange} style={inputStyle} />
                    ) : (
                        <div style={valueStyle}>{clase.tipo}</div>
                    )}
                </div>
            </div>

            {/* FECHA */}
            <div>
                <span style={labelStyle}>Fecha y Hora</span>
                {isEditing ? (
                    <input type="datetime-local" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} style={inputStyle} />
                ) : (
                    <div style={valueStyle}>{new Date(clase.fechaInicio).toLocaleString()}</div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* DURACION */}
                <div>
                    <span style={labelStyle}>Duración (min)</span>
                    {isEditing ? (
                        <input type="number" name="duracionMin" value={formData.duracionMin} onChange={handleChange} style={inputStyle} />
                    ) : (
                        <div style={valueStyle}>{clase.duracionMin} min</div>
                    )}
                </div>
                {/* CAPACIDAD */}
                <div>
                    <span style={labelStyle}>Capacidad Máxima</span>
                    {isEditing ? (
                        <input type="number" name="capacidadMaxima" value={formData.capacidadMaxima} onChange={handleChange} style={inputStyle} />
                    ) : (
                        <div style={valueStyle}>{clase.capacidadMaxima} Personas</div>
                    )}
                </div>
            </div>

            {/* BOTONES DE GUARDAR */}
            {isEditing && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={handleSave} style={{ flex: 1, background: NEON_ORANGE, color: 'white', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px' }}>
                        GUARDAR CAMBIOS
                    </button>
                    <button onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#333', color: 'white', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px' }}>
                        CANCELAR
                    </button>
                </div>
            )}
        </div>

        {/* --- LISTA DE ASISTENCIA --- */}
        {esDuenio && (
            <div style={{ marginTop: '50px' }}>
                <h2 style={{ color: NEON_ORANGE, marginBottom: '20px', borderBottom: `2px solid ${NEON_ORANGE}`, paddingBottom: '10px' }}>
                    ASISTENCIA ({inscritos.length}/{clase.capacidadMaxima})
                </h2>
                
                {inscritos.length === 0 ? (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>Aún no hay socios apuntados a esta clase.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ background: '#1a1a1a' }}>
                                <th style={{ textAlign: 'left', padding: '15px', color: NEON_ORANGE }}>Nombre</th>
                                <th style={{ textAlign: 'left', padding: '15px', color: NEON_ORANGE }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '15px', color: NEON_ORANGE }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscritos.map((usuario, index) => (
                                <tr key={usuario.id || index} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '15px' }}>
                                        {usuario.nombre} {usuario.apellido}
                                    </td>
                                    <td style={{ padding: '15px', color: '#aaa' }}>{usuario.email}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ color: NEON_GREEN, border: `1px solid ${NEON_GREEN}`, padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                            CONFIRMADO
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default ClaseDetails;