package com.example.usuarios.controller;

import com.example.usuarios.model.CrearUsuarioDTO;
import com.example.usuarios.model.UsuarioDTO;
import com.example.usuarios.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication; // <-- YA NO LO NECESITAS
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

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
     * Nuevo endpoint para obtener usuario pasando el ID de Firebase en la URL.
     * Url ejemplo: GET /api/usuarios/uid/56EdVKhtKpc058EIE84x0unodoJ3
     */
    @GetMapping("/uid/{firebaseUid}")
    public ResponseEntity<UsuarioDTO> getUsuarioPorFirebaseUid(@PathVariable String firebaseUid) {
        // Llamamos directamente al servicio con el String que nos llega
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorFirebaseUid(firebaseUid);
        return ResponseEntity.ok(usuario);
    }


    /**
     * Endpoint PROTEGIDO. Busca un usuario por su ID interno (Long).
     * Url ejemplo: GET /api/usuarios/1
     */

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioPorId(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorId(id);
        return ResponseEntity.ok(usuario);
    }


    /**
     * Endpoint para listar todos
     */

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getTodosLosUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }


    // --- BÚSQUEDAS ---

    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<UsuarioDTO>> getUsuariosPorNombre(@RequestParam("q") String nombre) {
        return ResponseEntity.ok(usuarioService.obtenerPorNombre(nombre));
    }


    @GetMapping("/buscar/estado")
    public ResponseEntity<List<UsuarioDTO>> getUsuariosPorEstado(@RequestParam("activo") boolean activo) {
        return ResponseEntity.ok(usuarioService.obtenerPorEstadoActivo(activo));
    }

}