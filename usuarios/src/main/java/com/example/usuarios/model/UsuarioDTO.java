package com.example.usuarios.model;

import lombok.*;

@Data
public class UsuarioDTO {
    
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
}
