package com.example.usuarios.model;

import lombok.Data;

@Data
public class CrearUsuarioDTO {
 
    private String firebaseUid;
    private String nombre;
    private String email;
    private Rol rol;

}
