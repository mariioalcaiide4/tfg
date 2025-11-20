// src/services/api.js

// La dirección de tu Gateway (Puerto 8084)
const GATEWAY_URL = "http://localhost:8084/api";

/**
 * 1. Obtener Perfil de Usuario
 * Llama a: GET /api/usuarios/uid/{id}
 */
export const getMiPerfil = async () => {
    // Recuperamos el ID que guardamos en el Login
    const uid = localStorage.getItem("usuarioId");

    if (!uid) return null; // Si no hay ID, no hacemos nada

    // Hacemos la llamada al backend
    const response = await fetch(`${GATEWAY_URL}/usuarios/uid/${uid}`);

    if (!response.ok) {
        throw new Error("Error al cargar perfil desde el Backend");
    }

    return await response.json(); // Devolvemos los datos limpios (JSON)
};

/**
 * 2. Crear Reserva (Lo usaremos en el siguiente paso)
 * Llama a: POST /api/reservas
 */
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
            usuarioId: uid, // ID texto de Firebase
            claseId: claseId // ID numérico de la clase
        }),
    });

    if (!response.ok) {
        throw new Error("Error al crear la reserva");
    }

    return await response.json();
};