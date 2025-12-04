package com.example.reservas.model;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    // El email u otros campos son opcionales, solo si los vas a usar en Reservas
}