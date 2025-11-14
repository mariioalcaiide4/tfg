package com.example.usuarios.controller;

import com.example.usuarios.model.CrearUsuarioDTO;
import com.example.usuarios.model.UsuarioDTO;
import com.example.usuarios.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * Endpoint PÚBLICO para sincronizar un usuario de Firebase con nuestra BD.
     */
    @PostMapping("/sincronizar")
    public ResponseEntity<UsuarioDTO> sincronizarUsuario(@RequestBody CrearUsuarioDTO crearUsuarioDTO) {
        UsuarioDTO nuevoUsuario = usuarioService.sincronizarUsuario(crearUsuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    /**
     * Endpoint PROTEGIDO. Devuelve el perfil del usuario que está haciendo la llamada.
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getMiPerfil(Authentication authentication) {
        String firebaseUid = authentication.getName(); 
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorFirebaseUid(firebaseUid);
        return ResponseEntity.ok(usuario);
    }

    /**
     * Endpoint PROTEGIDO. Busca un usuario por su ID interno (Long).
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioPorId(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorId(id);
        return ResponseEntity.ok(usuario);
    }

    /**
     * Endpoint PROTEGIDO (y deberías restringirlo solo a ADMINS).
     */
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getTodosLosUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // --- ENDPOINTS "MERGEADOS" (AÑADIDOS) ---

    /**
     * Endpoint PROTEGIDO. Busca usuarios por nombre.
     * Ejemplo: GET /api/usuarios/buscar/nombre?q=Mariano
     */
    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<UsuarioDTO>> getUsuariosPorNombre(@RequestParam("q") String nombre) {
        return ResponseEntity.ok(usuarioService.obtenerPorNombre(nombre));
    }

    /**
     * Endpoint PROTEGIDO. Busca usuarios por estado (activo=true o activo=false).
     * Ejemplo: GET /api/usuarios/buscar/estado?activo=true
     */
    @GetMapping("/buscar/estado")
    public ResponseEntity<List<UsuarioDTO>> getUsuariosPorEstado(@RequestParam("activo") boolean activo) {
        return ResponseEntity.ok(usuarioService.obtenerPorEstadoActivo(activo));
    }
}