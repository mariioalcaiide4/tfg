package com.example.reservas.controller;

import com.example.reservas.model.CrearReservaDTO;
import com.example.reservas.model.ReservaDTO;
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

    // PATCH /api/reservas/1/cancelar
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ReservaDTO> cancelarReserva(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.cancelarReserva(id));
    }
}