package com.example.usuarios.service;

import com.example.usuarios.model.Usuario;
import com.example.usuarios.model.CrearUsuarioDTO;
import com.example.usuarios.model.UsuarioDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper para convertir entre la entidad Usuario y sus DTOs.
 * Usa el componentModel "spring" para ser inyectable.
 */
// Le decimos a MapStruct que se integre con Spring
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UsuarioMapper {

    /**
     * Convierte la entidad Usuario -> UsuarioDTO (para salida).
     * Mapea automáticamente los campos que se llaman igual (id, nombre, email, rol).
     */
    UsuarioDTO toDTO(Usuario usuario);

    /**
     * Convierte el CrearUsuarioDTO -> entidad Usuario (para entrada).
     */
    @Mapping(target = "id", ignore = true)           // Ignora el 'id' (Long), porque lo genera la BD.
    @Mapping(target = "activo", ignore = true)       // Ignora 'activo', el servicio lo pondrá a 'true'.
    @Mapping(target = "creadoEn", ignore = true)     // Ignora 'creadoEn', la entidad lo pone por defecto.
    @Mapping(target = "firebaseUid", source = "firebaseUid") // Mapea el 'firebaseUid' del DTO.
    Usuario crearDTOToEntity(CrearUsuarioDTO crearUsuarioDTO);
}