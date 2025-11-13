package com.example.clases.service;

import com.example.clases.model.Clase;
import com.example.clases.model.ClaseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring") // Se integra con Spring
public interface ClaseMapper {
    
    ClaseDTO toDto(Clase clase);
    
    Clase toEntity(ClaseDTO claseDto);
}