package com.example.clases.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.clases.model.Clase;

public interface ClaseRepository extends JpaRepository<Clase, Long> {
    
}
