package com.example.clases.controller;

import com.example.clases.model.ClaseDTO;
import com.example.clases.service.ClaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clases") // La URL base para todas las operaciones de clases
@RequiredArgsConstructor

public class ClaseController {

    private final ClaseService claseService;

    // GET /api/clases -> Obtener todas
    @GetMapping
    public ResponseEntity<List<ClaseDTO>> obtenerTodasLasClases() {
        List<ClaseDTO> clases = claseService.obtenerTodasLasClases();
        return ResponseEntity.ok(clases); // Devuelve 200 OK
    }

    // GET /api/clases/1 -> Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<ClaseDTO> obtenerClasePorId(@PathVariable Long id) {
        ClaseDTO clase = claseService.obtenerClasePorId(id);
        return ResponseEntity.ok(clase); // Devuelve 200 OK
    }

    // POST /api/clases -> Crear una nueva
    @PostMapping
    public ResponseEntity<ClaseDTO> crearClase(@RequestBody ClaseDTO claseDTO) {
        ClaseDTO nuevaClase = claseService.guardarClase(claseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaClase); // Devuelve 201 Created
    }

    // PUT /api/clases/1 -> Actualizar una existente
    @PutMapping("/{id}")
    public ResponseEntity<ClaseDTO> actualizarClase(@PathVariable Long id, @RequestBody ClaseDTO claseDTO) {
        ClaseDTO claseActualizada = claseService.actualizarClase(id, claseDTO);
        return ResponseEntity.ok(claseActualizada); // Devuelve 200 OK
    }

    // DELETE /api/clases/1 -> Eliminar una
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarClase(@PathVariable Long id) {
        claseService.eliminarClase(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
