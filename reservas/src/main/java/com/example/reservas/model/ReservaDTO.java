package com.example.reservas.model;

import java.time.Instant;
import lombok.Data;

@Data
public class ReservaDTO {
    
    private Long id;
    private String usuarioId;
    private Long claseId;
    private Instant fechaReserva;
    private EstadoReserva estado;
    
    // Estos campos se rellenarían llamando a los otros servicios
    private String nombreUsuario;
    private String nombreClase;
}
