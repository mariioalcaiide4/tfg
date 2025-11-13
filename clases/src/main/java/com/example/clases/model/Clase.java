package com.example.clases.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "clases")

public class Clase {   

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 80)
    private String categoria;

    @Column(nullable = false, length = 40)
    private String tipo;

    @Column(name = "entrenador_id", nullable = false)
    private Long entrenadorId; // ID del usuario con rol 'ENTRENADOR'

    @Column(name = "fecha_inicio", nullable = false)
    private Instant fechaInicio;

    @Column(name = "duracion_min", nullable = false)
    private int duracionMin;

    @Column(name = "capacidad_maxima", nullable = false)
    private int capacidadMaxima;

    @Column(name = "inscritos_actuales", nullable = false)
    private int inscritosActuales = 0;

}
