package com.example.reservas.service;

import com.example.reservas.model.Reserva;
import com.example.reservas.model.CrearReservaDTO;
import com.example.reservas.model.ReservaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper para convertir entre la entidad Reserva y sus DTOs.
 * Usa el componentModel "spring" para ser inyectable.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReservaMapper {

    /**
     * Convierte la entidad Reserva a ReservaDTO (para salida).
     */
    ReservaDTO toDTO(Reserva reserva);

    /**
     * Convierte ReservaDTO (de salida) a la entidad Reserva.
     */
    Reserva toEntity(ReservaDTO reservaDTO);

    /**
     * Convierte el DTO de creación (entrada) a la entidad Reserva.
     * * Nota: MapStruct mapeará automáticamente los campos que se llamen igual
     * (ej: usuarioId, claseId, fecha).
     * Los campos que no existan en el DTO (como 'id', 'estado')
     * quedarán nulos en la Entidad, ¡perfecto para que el servicio los rellene!
     */
    Reserva crearDTOToEntity(CrearReservaDTO crearReservaDTO);
}
