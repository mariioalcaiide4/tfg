import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { getClaseById, updateClase, getUsuariosPorClase } from '../services/api';

// --- ESTÉTICA NEÓN ---
const NEON_GREEN = '#00ff6a';
const DARK_BG = '#121212';
const INPUT_BG = '#1e1e1e';
const TEXT_WHITE = '#ffffff';

const ClaseDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const { user } = useAuth(); // Obtenemos el usuario logueado
  const navigate = useNavigate();

  const [clase, setClase] = useState(null);
  const [inscritos, setInscritos] = useState([]); // Lista de usuarios (Solo entrenador)
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Modo edición

  // Estado para el formulario
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
        // 1. Cargar la clase
        const data = await getClaseById(id);
        setClase(data);
        
        // Preparamos el form (convertir fecha para input datetime-local)
        setFormData({
            nombre: data.nombre,
            categoria: data.categoria,
            tipo: data.tipo,
            // Truco para input date: cortar los milisegundos si vienen
            fechaInicio: data.fechaInicio ? data.fechaInicio.substring(0, 16) : '', 
            duracionMin: data.duracionMin || 60,
            capacidadMaxima: data.capacidadMaxima
        });

        // 2. Si es ENTRENADOR, cargar los inscritos
        if (user && user.rol === 'ENTRENADOR') {
            const usersData = await getUsuariosPorClase(id);
            setInscritos(usersData);
        }

      } catch (error) {
        console.error(error);
        alert("Error al cargar detalles");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id, user]);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
      try {
          await updateClase(id, formData);
          alert("✅ Clase actualizada correctamente");
          setIsEditing(false);
          // Recargamos los datos visuales
          setClase({ ...clase, ...formData });
      } catch (error) {
          alert("❌ Error al guardar");
      }
  };

  if (loading) return <div style={{ background: DARK_BG, minHeight: '100vh', color: NEON_GREEN, paddingTop: '100px', textAlign: 'center' }}>Cargando...</div>;

  const esEntrenador = user?.rol === 'ENTRENADOR';

  // Estilos de Inputs
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

  // Estilos de Etiquetas (Read-only)
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
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: NEON_GREEN, textShadow: `0 0 10px ${NEON_GREEN}` }}>
                {isEditing ? 'Editar Clase' : clase.nombre}
            </h1>
            
            {esEntrenador && !isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'transparent', border: `1px solid ${NEON_GREEN}`, color: NEON_GREEN, padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
                >
                    🔧 EDITAR DATOS
                </button>
            )}
        </div>

        {/* FORMULARIO / VISTA DETALLE */}
        <div style={{ background: '#000', padding: '30px', borderRadius: '15px', border: `1px solid ${NEON_GREEN}`, boxShadow: `0 0 20px ${NEON_GREEN}20` }}>
            
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

            {/* BOTONES DE GUARDAR (SOLO EDICIÓN) */}
            {isEditing && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={handleSave} style={{ flex: 1, background: NEON_GREEN, color: 'black', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px' }}>
                        GUARDAR CAMBIOS
                    </button>
                    <button onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#333', color: 'white', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px' }}>
                        CANCELAR
                    </button>
                </div>
            )}
        </div>

        {/* --- SECCIÓN INFERIOR: TABLA DE USUARIOS (SOLO ENTRENADOR) --- */}
        {esEntrenador && (
            <div style={{ marginTop: '50px' }}>
                <h2 style={{ color: NEON_GREEN, marginBottom: '20px' }}>📋 Lista de Asistencia</h2>
                
                {inscritos.length === 0 ? (
                    <p style={{ color: '#888' }}>Aún no hay usuarios inscritos en esta clase.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: `2px solid ${NEON_GREEN}` }}>
                                <th style={{ textAlign: 'left', padding: '10px', color: NEON_GREEN }}>ID Usuario</th>
                                <th style={{ textAlign: 'left', padding: '10px', color: NEON_GREEN }}>Nombre</th>
                                <th style={{ textAlign: 'left', padding: '10px', color: NEON_GREEN }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '10px', color: NEON_GREEN }}>Fecha Inscripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscritos.map((usuario, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                                    {/* Ajusta estos campos según lo que devuelva tu backend */}
                                    <td style={{ padding: '10px' }}>{usuario.id}</td>
                                    <td style={{ padding: '10px' }}>{usuario.nombre}</td>
                                    <td style={{ padding: '10px' }}>{usuario.email}</td>
                                    <td style={{ padding: '10px' }}>{new Date().toLocaleDateString()}</td> 
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