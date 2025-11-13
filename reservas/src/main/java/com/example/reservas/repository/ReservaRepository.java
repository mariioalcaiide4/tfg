package com.example.reservas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reservas.model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    boolean existsByUsuarioIdAndClaseId(Long usuarioId, Long claseId);

    List<Reserva> findByUsuarioId(Long usuarioId);

}
