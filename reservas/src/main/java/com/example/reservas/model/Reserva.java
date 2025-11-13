package com.example.reservas.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;


@Data
@NoArgsConstructor
@Entity
@Table(name = "reservas",
       uniqueConstraints = {
           // Evita reservas duplicadas, como pide tu DDL [cite: 249] y HU-11 [cite: 50]
           @UniqueConstraint(columnNames = {"usuario_id", "clase_id"}) 
       }
)
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId; // ID del Usuario

    @Column(name = "clase_id", nullable = false)
    private Long claseId; // ID de la Clase

    @Column(name = "fecha_reserva", nullable = false, updatable = false)
    private Instant fechaReserva = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoReserva estado; //

}
