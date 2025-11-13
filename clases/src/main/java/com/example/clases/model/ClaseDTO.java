package com.example.clases.model;

import lombok.*;
import java.time.Instant;

@Data
public class ClaseDTO {
    
    private Long id;
    private String nombre;
    private String categoria;
    private String tipo;
    private Long entrenadorId;
    private Instant fechaInicio;
    private int duracionMin;
    private int capacidadMaxima;
    private int inscritosActuales;

    public int getPlazasLibres(){
        return capacidadMaxima - inscritosActuales;
    }

}
