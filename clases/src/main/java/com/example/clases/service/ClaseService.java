package com.example.clases.service;

import com.example.clases.model.ClaseDTO;
import java.util.List;

/**
 * Interfaz para el servicio de Clases.
 * Define los métodos de negocio que se pueden realizar sobre las clases.
 */
public interface ClaseService {

    /**
     * Busca una clase por su ID.
     * @param id El ID de la clase a buscar.
     * @return El DTO de la clase encontrada.
     */
    ClaseDTO obtenerClasePorId(Long id);

    /**
     * Obtiene una lista de todas las clases.
     * @return Una lista de DTOs de todas las clases.
     */
    List<ClaseDTO> obtenerTodasLasClases();

    /**
     * Guarda (crea o actualiza) una clase.
     * @param claseDTO El DTO de la clase a guardar.
     * @return El DTO de la clase guardada.
     */
    ClaseDTO guardarClase(ClaseDTO claseDTO);

    ClaseDTO actualizarClase(Long id, ClaseDTO claseDTO);

    /**
     * Elimina una clase por su ID.
     * @param id El ID de la clase a eliminar.
     */
    void eliminarClase(Long id);
}