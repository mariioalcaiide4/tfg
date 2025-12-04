// src/services/api.js

// La dirección de tu Gateway (Puerto 8084)

const GATEWAY_URL = "http://localhost:8084/api";

const fechaActual = new Date().toISOString();


/**
 * 1. Obtener Perfil de Usuario
 * Llama a: GET /api/usuarios/uid/{id}
 */
export const getMiPerfil = async () => {
    // Recuperamos el ID que guardamos en el Login
    const uid = localStorage.getItem("usuarioId");

    if (!uid) return null; // Si no hay ID, no hacemos nada

    // Variable para la fecha actual
    
    // Llevamos al backend
    const response = await fetch(`${GATEWAY_URL}/usuarios/uid/${uid}`);

    if (!response.ok) {
        throw new Error("Error al cargar perfil desde el Backend");
    }

    return await response.json(); // Devolvemos los datos limpios (JSON)
};

export const obtenerUsuarios = async () => {
    // Ajusta esta ruta a la que devuelva tu lista de usuarios/entrenadores
    const response = await fetch(`${GATEWAY_URL}/usuarios`); 
    
    if (!response.ok) {
        throw new Error("Error al obtener usuarios");
    }
    return await response.json();
};

export const crearReserva = async (claseId) => {
    const uid = localStorage.getItem("usuarioId");
    
    if (!uid) {
        alert("¡No estás logueado!");
        return;
    }

    const response = await fetch(`${GATEWAY_URL}/reservas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            usuarioId: uid,
            claseId: claseId,
            fechaReserva: fechaActual
        }),
    });

    if (!response.ok) {
        throw new Error("Error al crear la reserva");
    }

    return await response.json();
};

export const getMisReservas = async () => {
    const uid = localStorage.getItem("usuarioId");
    if (!uid) return [];

    const response = await fetch(`${GATEWAY_URL}/reservas/usuario/${uid}`);

    if (!response.ok) {
        console.error("Error al cargar reservas");
        return [];
    }

    return await response.json();
};

export const cancelarReserva = async (idReserva) => {
    const response = await fetch(`${GATEWAY_URL}/reservas/${idReserva}/cancelar`, {
        method: "PATCH", // Importante: Coincide con tu Backend
    });

    if (!response.ok) {
        throw new Error("No se pudo cancelar la reserva");
    }

    return await response.json();
};

export const sincronizarUsuario = async (datosUsuario) => {
    const response = await fetch(`${GATEWAY_URL}/usuarios/sincronizar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosUsuario),
    });

    if (!response.ok) {
        throw new Error("Error al guardar el usuario en la base de datos local");
    }

    return await response.json();
};

export const obtenerClases = async () => {

    const response = await fetch(`${GATEWAY_URL}/clases`);

    if (!response.ok) {
        throw new Error("Error al obtener las clases");
    }

    return await response.json();
};

// Obtener detalle de una sola clase
export const getClaseById = async (id) => {
    const response = await fetch(`${GATEWAY_URL}/clases/${id}`);
    if (!response.ok) throw new Error("Error al cargar la clase");
    return await response.json();
};

// Actualizar clase (Solo Entrenadores)
export const updateClase = async (id, datosActualizados) => {
    const response = await fetch(`${GATEWAY_URL}/clases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
    });
    if (!response.ok) throw new Error("Error al actualizar la clase");
    return await response.json();
};

// Obtener lista de inscritos (Necesitas este endpoint en tu backend)
// Si no lo tienes, el frontend fallará al intentar cargar la tabla.
export const getUsuariosPorClase = async (claseId) => {
    // Esta ruta debe estar abierta en Spring Security (.permitAll())
    // O bien, el usuario debe tener ROL_ENTRENADOR y Token válido
    const response = await fetch(`${GATEWAY_URL}/reservas/clase/${claseId}/usuarios`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }     
    });
    
    if (!response.ok) {
        // Si devuelve 403 o 401, es probable que la seguridad no esté bien configurada
        throw new Error('Error al obtener usuarios inscritos');
    }
    return await response.json();
};

export const createClase = async (claseData) => {
    try {
        const response = await fetch(`${GATEWAY_URL}/clases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si tu backend usa seguridad JWT, descomenta la siguiente línea:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(claseData)
        });

        if (!response.ok) {
            // Intentamos leer el error que devuelve el servidor
            const errorMsg = await response.text();
            throw new Error(errorMsg || 'Error al conectar con el servidor');
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createClase:", error);
        throw error; // Lanzamos el error para que el componente (CrearClase.jsx) muestre el alert
    }
};

export const deleteClase = async (id) => {
    const response = await fetch(`${GATEWAY_URL}/clases/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Si usas seguridad
        }
    });

    if (!response.ok) {
        throw new Error('Error al eliminar la clase');
    }
    // Si el backend no devuelve nada (204 No Content), devolvemos true
    return true;
};

export const updateUsuario = async (id, usuarioData) => {
    const response = await fetch(`${GATEWAY_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
    });

    if (!response.ok) {
        throw new Error('Error al actualizar perfil de usuario');
    }
    return await response.json();
};