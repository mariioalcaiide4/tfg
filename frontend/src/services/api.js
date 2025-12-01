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
    const response = await fetch(`${GATEWAY_URL}/reservas/clase/${claseId}/usuarios`);
    if (!response.ok) return []; // Retornamos array vacío si falla o no existe
    return await response.json();
};