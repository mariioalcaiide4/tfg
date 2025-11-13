package com.example.reservas.service;

import com.example.reservas.model.CrearReservaDTO;
import com.example.reservas.model.ReservaDTO;
import java.util.List;

public interface ReservaService {

    /**
     * Crea una nueva reserva.
     * @param crearReservaDTO Datos para la nueva reserva.
     * @return La reserva creada con su ID y estado.
     */
    ReservaDTO crearReserva(CrearReservaDTO crearReservaDTO);

    /**
     * Busca una reserva por su ID.
     */
    ReservaDTO obtenerReservaPorId(Long id);

    /**
     * Busca todas las reservas de un usuario.
     */
    List<ReservaDTO> obtenerReservasPorUsuario(Long usuarioId);

    /**
     * Cancela una reserva (la marca como CANCELADA).
     */
    ReservaDTO cancelarReserva(Long id);

    /**
     * Obtiene todas las reservas (para un admin, por ejemplo).
     */
    List<ReservaDTO> obtenerTodasLasReservas();
}
