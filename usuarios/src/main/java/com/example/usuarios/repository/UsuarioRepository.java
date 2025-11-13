package com.example.usuarios.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.usuarios.model.Usuario;
import java.util.*;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByActivo (boolean activo);
    List<Usuario> findByNombre (String nombre);
    Optional<Usuario> findByFirebaseUid(String firebaseUid);
}
