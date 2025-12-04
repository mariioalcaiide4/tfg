import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createClase, getMiPerfil } from '../services/api'; 

const NEON_ORANGE = '#FF6600'; 
const DARK_BG = '#000000';
const INPUT_BG = '#121212';
const TEXT_WHITE = '#ffffff';

const CrearClase = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // ARREGLO 1: Guardamos el Rol y el ID real de la base de datos
    const [dbRole, setDbRole] = useState(null); 
    const [entrenadorDbId, setEntrenadorDbId] = useState(null); 

    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        tipo: '',
        fechaInicio: '',
        duracionMin: 60,
        capacidadMaxima: 20
    });

    useEffect(() => {
        const fetchPerfil = async () => {
            if (user) {
                try {
                    const perfil = await getMiPerfil();
                    // ARREGLO 1: Guardamos los datos reales
                    setDbRole(perfil.rol); 
                    setEntrenadorDbId(perfil.id); 
                } catch (error) {
                    console.error("Error cargando perfil", error);
                }
            }
        };
        fetchPerfil();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !entrenadorDbId) {
            alert("Error: No se ha cargado la información del entrenador.");
            return;
        }

        setLoading(true);
        try {
            // ARREGLO 2: Formatear la fecha para que Java no explote
            // Convertimos la fecha del input a formato ISO completo (ej: 2023-10-05T14:30:00Z)
            const fechaFormateada = new Date(formData.fechaInicio).toISOString();

            const nuevaClase = {
                ...formData,
                fechaInicio: fechaFormateada, // Usamos la fecha corregida
                entrenadorId: entrenadorDbId, // ARREGLO 3: Usamos el ID numérico, no el de Firebase
                plazasOcupadas: 0,
                activa: true
            };

            await createClase(nuevaClase);
            
            alert("✅ ¡Clase creada con éxito!");
            navigate('/dashboard'); 
        } catch (error) {
            console.error("Error creando clase:", error);
            alert("❌ Error al crear la clase. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: INPUT_BG,
        border: `1px solid ${NEON_ORANGE}`,
        color: TEXT_WHITE,
        padding: '12px',
        borderRadius: '8px',
        width: '100%',
        marginBottom: '20px',
        fontSize: '1rem',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        color: NEON_ORANGE,
        marginBottom: '8px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    };

    // --- PROTECCIÓN DE RUTA CORREGIDA ---
    if (!user) return null;

    // Si aún no sabemos el rol real, mostramos cargando en vez de echarte
    if (!dbRole) {
        return (
            <div style={{ background: DARK_BG, minHeight: '100vh', paddingTop: '100px', textAlign: 'center', color: 'white' }}>
                <h2 style={{color: NEON_ORANGE}}>Cargando permisos...</h2>
            </div>
        );
    }

    // Solo te echa si YA cargó el perfil y resulta que NO eres entrenador
    if (dbRole !== 'ENTRENADOR') {
        return (
            <div style={{ background: DARK_BG, minHeight: '100vh', paddingTop: '100px', textAlign: 'center', color: 'red' }}>
                <h1>ACCESO DENEGADO</h1>
                <p>Necesitas permisos de Entrenador.</p>
                <button onClick={() => navigate('/dashboard')} style={{padding: 10, marginTop: 20}}>Volver</button>
            </div>
        );
    }

    return (
        <div style={{ 
            background: DARK_BG, 
            minHeight: '100vh', 
            paddingTop: '100px', 
            display: 'flex', 
            justifyContent: 'center' 
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '600px', 
                padding: '40px', 
                background: '#111', 
                borderRadius: '20px', 
                border: `1px solid ${NEON_ORANGE}`,
                boxShadow: `0 0 30px ${NEON_ORANGE}30`
            }}>
                <h1 style={{ 
                    color: NEON_ORANGE, 
                    textAlign: 'center', 
                    marginBottom: '30px',
                    textShadow: `0 0 10px ${NEON_ORANGE}`
                }}>
                    NUEVA CLASE
                </h1>

                <form onSubmit={handleSubmit}>
                    
                    <div>
                        <label style={labelStyle}>Nombre de la Clase</label>
                        <input 
                            name="nombre" 
                            placeholder="Ej: Crossfit Explosivo" 
                            required 
                            onChange={handleChange} 
                            style={inputStyle} 
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Categoría</label>
                            <input 
                                name="categoria" 
                                placeholder="Ej: Fuerza" 
                                required 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Intensidad / Tipo</label>
                            <input 
                                name="tipo" 
                                placeholder="Ej: Alta" 
                                required 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Fecha y Hora de Inicio</label>
                        <input 
                            type="datetime-local" 
                            name="fechaInicio" 
                            required 
                            onChange={handleChange} 
                            style={{...inputStyle, colorScheme: 'dark'}} 
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Duración (min)</label>
                            <input 
                                type="number" 
                                name="duracionMin" 
                                defaultValue={60} 
                                // Corregido para que guarde el valor por defecto si no lo tocas
                                value={formData.duracionMin}
                                required 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Aforo Máximo</label>
                            <input 
                                type="number" 
                                name="capacidadMaxima" 
                                defaultValue={20} 
                                // Corregido para que guarde el valor por defecto si no lo tocas
                                value={formData.capacidadMaxima}
                                required 
                                onChange={handleChange} 
                                style={inputStyle} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: NEON_ORANGE,
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '20px',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'PUBLICANDO...' : 'PUBLICAR CLASE'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CrearClase;