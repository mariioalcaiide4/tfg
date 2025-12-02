package com.example.usuarios.model;

import lombok.Data;
import java.time.LocalDate;


@Data
public class CrearUsuarioDTO {
 
    private String firebaseUid;
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
    private LocalDate fechaNacimiento;
    private String email;
    private Rol rol;

}