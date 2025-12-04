package com.example.reservas.service.impl;

import com.example.reservas.model.CrearReservaDTO;
import com.example.reservas.model.EstadoReserva;
import com.example.reservas.model.Reserva;
import com.example.reservas.model.ReservaDTO;
import com.example.reservas.repository.ReservaRepository;
import com.example.reservas.service.ReservaMapper;
import com.example.reservas.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.reservas.model.UsuarioDTO;
import com.example.reservas.client.UsuarioClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final ReservaMapper reservaMapper;
    private final UsuarioClient usuarioClient;

    @Override
    public ReservaDTO crearReserva(CrearReservaDTO crearReservaDTO) {
        Reserva reserva = reservaMapper.crearDTOToEntity(crearReservaDTO);
        reserva.setEstado(EstadoReserva.PENDIENTE);
        Reserva reservaGuardada = reservaRepository.save(reserva);
        return reservaMapper.toDTO(reservaGuardada);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservaDTO obtenerReservaPorId(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));
        return reservaMapper.toDTO(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    // CAMBIO CLAVE: Añadido el tipo String que faltaba
    public List<ReservaDTO> obtenerReservasPorUsuario(String usuarioId) {
        List<Reserva> reservas = reservaRepository.findByUsuarioId(usuarioId);
        return reservas.stream()
                .map(reservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReservaDTO cancelarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new IllegalStateException("La reserva ya está cancelada.");
        }

        reserva.setEstado(EstadoReserva.CANCELADA);
        Reserva reservaCancelada = reservaRepository.save(reserva);
        return reservaMapper.toDTO(reservaCancelada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaDTO> obtenerTodasLasReservas() {
        return reservaRepository.findAll().stream()
                .map(reservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UsuarioDTO> obtenerUsuariosPorClase(Long claseId) {
    // 1. Sacamos las reservas de la BD local
    List<Reserva> reservas = reservaRepository.findByClaseId(claseId);
    
    // 2. Extraemos los 'firebaseUid' (que guardaste en el campo usuarioId)
    List<String> firebaseUids = reservas.stream()
            .map(Reserva::getUsuarioId) // Esto devuelve Strings tipo "56EdVK..."
            .distinct()
            .collect(Collectors.toList());

    // 3. Llamamos a Usuarios pasándole esos "firebaseUids"
    return usuarioClient.obtenerUsuariosPorListaIds(firebaseUids);
    }
}