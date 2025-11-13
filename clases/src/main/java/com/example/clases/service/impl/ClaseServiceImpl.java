package com.example.clases.service.impl;

import com.example.clases.model.Clase;
import com.example.clases.model.ClaseDTO;
import com.example.clases.repository.ClaseRepository; // Asegúrate de que este import es correcto
import com.example.clases.service.ClaseMapper;
import com.example.clases.service.ClaseService;
import com.example.clases.util.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service // Marca esta clase como un Bean de Servicio de Spring
@RequiredArgsConstructor // Lombok: crea un constructor con los campos 'final'
@Transactional // Todos los métodos públicos serán transaccionales
public class ClaseServiceImpl implements ClaseService {

    // Spring inyectará automáticamente el Repository y el Mapper gracias a @RequiredArgsConstructor
    private final ClaseRepository claseRepository;
    private final ClaseMapper claseMapper;

    @Override
    @Transactional(readOnly = true) // Optimizamos para que esta transacción sea solo de lectura
    public ClaseDTO obtenerClasePorId(Long id) {
        // 1. Busca la entidad en la BD
        Clase clase = claseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada con id: " + id)); // Deberías crear una excepción custom
        
        // 2. Usa el mapper para convertir la Entidad a DTO
        return claseMapper.toDto(clase);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaseDTO> obtenerTodasLasClases() {
        // 1. Busca todas las entidades
        List<Clase> clases = claseRepository.findAll();

        // 2. Mapea la lista de Entidades a una lista de DTOs
        return clases.stream()
                .map(claseMapper::toDto) // Es lo mismo que .map(clase -> claseMapper.toDTO(clase))
                .collect(Collectors.toList());
    }

    @Override
    public ClaseDTO guardarClase(ClaseDTO claseDTO) {
        // 1. Usa el mapper para convertir el DTO (datos de entrada) a Entidad
        Clase clase = claseMapper.toEntity(claseDTO);

        // 2. Guarda la entidad en la BD
        Clase claseGuardada = claseRepository.save(clase);

        // 3. Devuelve el DTO de la entidad guardada (que ahora tiene un ID)
        return claseMapper.toDto(claseGuardada);
    }

    @Override
    public ClaseDTO actualizarClase(Long id, ClaseDTO claseDTO) {
        // 1. Comprobar si existe
        Clase claseExistente = claseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada con id: " + id));

        claseExistente.setNombre(claseDTO.getNombre());
        claseExistente.setTipo(claseDTO.getTipo());
        claseExistente.setCapacidadMaxima(claseDTO.getCapacidadMaxima());
        claseExistente.setCategoria(claseDTO.getCategoria());
        claseExistente.setEntrenadorId(claseDTO.getEntrenadorId());
        claseExistente.setFechaInicio(claseDTO.getFechaInicio());
        claseExistente.setDuracionMin(claseDTO.getDuracionMin());

        // 3. Guardar la entidad actualizada
        Clase claseActualizada = claseRepository.save(claseExistente);

        // 4. Devolver el DTO
        return claseMapper.toDto(claseActualizada);
    }
    
    @Override
    public void eliminarClase(Long id) {
        // (Opcional) Comprueba si existe antes de borrar
        if (!claseRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Clase no encontrada con id: " + id);
        }
        
        // 1. Elimina la clase por su ID
        claseRepository.deleteById(id);
    }
}