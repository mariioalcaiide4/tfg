package com.example.usuarios.service;

// --- Imports (Probablemente te faltaban estos) ---
import com.example.usuarios.model.CrearUsuarioDTO;
import com.example.usuarios.model.UsuarioDTO;
// ---------------------------------------------

import java.util.List;

public interface UsuarioService {

    /**
     * Sincroniza (crea) un usuario de Firebase en nuestra BD local.
     */
    UsuarioDTO sincronizarUsuario(CrearUsuarioDTO crearUsuarioDTO);

    /**
     * Busca un usuario por su ID de BD (Long).
     */
    UsuarioDTO obtenerUsuarioPorId(Long id);

    /**
     * Busca un usuario por su UID de Firebase (String).
     */
    UsuarioDTO obtenerUsuarioPorFirebaseUid(String firebaseUid);

    /**
     * Obtiene todos los usuarios.
     */
    List<UsuarioDTO> obtenerTodos();

    // --- MÉTODOS "MERGEADOS" (AÑADIDOS) ---

    /**
     * Busca usuarios por su nombre.
     */
    List<UsuarioDTO> obtenerPorNombre(String nombre);

    /**
     * Busca usuarios que están activos o inactivos.
     */
    List<UsuarioDTO> obtenerPorEstadoActivo(boolean activo);
}