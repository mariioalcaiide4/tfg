package com.example.reservas.client;

import com.example.reservas.model.UsuarioDTO; // Importarás el DTO que creamos abajo
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

@FeignClient(name = "usuarios", url = "http://localhost:8081") // Ojo al puerto/nombre
public interface UsuarioClient {
    
    // Este método debe coincidir con el que creaste en el Paso 1.2
    @PostMapping("/api/usuarios/batch")
    List<UsuarioDTO> obtenerUsuariosPorListaIds(@RequestBody List<String> ids);
}
