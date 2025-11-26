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