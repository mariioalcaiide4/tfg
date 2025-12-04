package com.example.reservas.controller;

import com.example.reservas.model.CrearReservaDTO;
import com.example.reservas.model.ReservaDTO;
import com.example.reservas.model.UsuarioDTO;
import com.example.reservas.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor

public class ReservaController {

    private final ReservaService reservaService;

    // POST /api/reservas
    @PostMapping
    public ResponseEntity<ReservaDTO> crearReserva(@RequestBody CrearReservaDTO crearReservaDTO) {
        ReservaDTO nuevaReserva = reservaService.crearReserva(crearReservaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaReserva);
    }

    // GET /api/reservas
    @GetMapping
    public ResponseEntity<List<ReservaDTO>> obtenerTodasLasReservas() {
        return ResponseEntity.ok(reservaService.obtenerTodasLasReservas());
    }

    // GET /api/reservas/1
    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> obtenerReservaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.obtenerReservaPorId(id));
    }

    // GET /api/reservas/usuario/5 (por ejemplo)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaDTO>> obtenerReservasPorUsuario(@PathVariable String usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerReservasPorUsuario(usuarioId));
    }

    // GET http://localhost:8082/api/reservas/clase/{claseId}/usuarios
    @GetMapping("/clase/{claseId}/usuarios")
    public ResponseEntity<List<UsuarioDTO>> obtenerUsuariosPorClase(@PathVariable Long claseId) {
        
        // Llamamos al servicio (que ahora hace la magia con Feign)
        List<UsuarioDTO> usuarios = reservaService.obtenerUsuariosPorClase(claseId);
        
        return ResponseEntity.ok(usuarios);
    }

    // PATCH /api/reservas/1/cancelar
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ReservaDTO> cancelarReserva(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.cancelarReserva(id));
    }
}