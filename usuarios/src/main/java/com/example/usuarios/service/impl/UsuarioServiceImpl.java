package com.example.usuarios.service.impl;

import com.example.usuarios.model.Usuario;
import com.example.usuarios.model.CrearUsuarioDTO;
import com.example.usuarios.model.UsuarioDTO;
import com.example.usuarios.repository.UsuarioRepository;
import com.example.usuarios.service.UsuarioMapper;
import com.example.usuarios.service.UsuarioService;
import com.example.usuarios.util.ResourceNotFoundException; // Asegúrate de tener tu clase de excepción
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public UsuarioDTO sincronizarUsuario(CrearUsuarioDTO crearUsuarioDTO) {
        
        // Comprobar si el usuario ya existe por su UID de Firebase
        if (usuarioRepository.findByFirebaseUid(crearUsuarioDTO.getFirebaseUid()).isPresent()) {
            throw new IllegalStateException("El usuario de Firebase ya está sincronizado.");
        }
        
        // Comprobar si el email ya existe
        if (usuarioRepository.findByEmail(crearUsuarioDTO.getEmail()).isPresent()) {
            throw new IllegalStateException("El email ya está en uso por otra cuenta.");
        }

        // Convertir DTO a Entidad
        Usuario nuevoUsuario = usuarioMapper.crearDTOToEntity(crearUsuarioDTO);
        
        // (La entidad ya pone 'activo=true' y 'creadoEn' por defecto)
        
        // Guardar en la BD
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // Devolver el DTO de salida
        return usuarioMapper.toDTO(usuarioGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id (BD): " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerUsuarioPorFirebaseUid(String firebaseUid) {
        return usuarioRepository.findByFirebaseUid(firebaseUid)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id (Firebase): " + firebaseUid));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // --- IMPLEMENTACIÓN DE MÉTODOS "MERGEADOS" ---

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerPorNombre(String nombre) {
        List<Usuario> usuarios = usuarioRepository.findByNombre(nombre);
        return usuarios.stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerPorEstadoActivo(boolean activo) {
        List<Usuario> usuarios = usuarioRepository.findByActivo(activo);
        return usuarios.stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UsuarioDTO> listarUsuariosPorIds(List<String> firebaseUids) {
        // 1. Buscamos los usuarios usando los UIDs de Firebase
        List<Usuario> usuarios = usuarioRepository.findByFirebaseUidIn(firebaseUids);

        // 2. Convertimos a DTO (Aquí se rellenan el nombre y apellido)
        return usuarios.stream()
                .map(usuario -> {
                    UsuarioDTO dto = new UsuarioDTO();
                    // Mapeamos los datos que queremos mostrar
                    dto.setId(usuario.getId());
                    dto.setNombre(usuario.getNombre());
                    dto.setApellido(usuario.getApellido());
                    dto.setEmail(usuario.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioDTO actualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id (BD): " + id));

        // El frontend solo envía los campos que se pueden editar.
        // Actualizamos la entidad existente con los datos del DTO.
        
        // NOTA: Asumimos que los campos del DTO (nombre, telefono, etc.) corresponden a los campos de la entidad.
        if (usuarioDTO.getNombre() != null) {
            usuarioExistente.setNombre(usuarioDTO.getNombre());
        }
        if (usuarioDTO.getApellido() != null) {
            usuarioExistente.setApellido(usuarioDTO.getApellido());
        }
        if (usuarioDTO.getTelefono() != null) {
            usuarioExistente.setTelefono(usuarioDTO.getTelefono());
        }
        if (usuarioDTO.getDireccion() != null) {
            usuarioExistente.setDireccion(usuarioDTO.getDireccion());
        }
        
        // La fecha de nacimiento la recibimos como String YYYY-MM-DD
        if (usuarioDTO.getFechaNacimiento() != null) {
            usuarioExistente.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
        }
        
        // El email y el rol NO se deben actualizar desde aquí.

        Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);
        
        // Devolvemos el DTO completo para actualizar la vista en el frontend
        return usuarioMapper.toDTO(usuarioActualizado);
    }
}