package com.example.usuarios.model;

import lombok.*;
import java.time.LocalDate;

@Data
public class UsuarioDTO {
    
    private Long id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
    private LocalDate fechaNacimiento;
    private String email;
    private Rol rol;
}
