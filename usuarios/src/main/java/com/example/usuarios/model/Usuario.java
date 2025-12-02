package com.example.usuarios.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor

@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String firebaseUid;
    
    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 120)
    private String apellido;

    @Column(nullable = false, length = 120)
    private String direccion;
    
    @Column(nullable = false, length = 15)
    private String telefono;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;
    
    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private Instant creadoEn = Instant.now();

}
