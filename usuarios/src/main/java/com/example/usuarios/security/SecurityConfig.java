package com.example.usuarios.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Configuración de CORS (Vital para que React hable con Spring)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 2. Desactivar CSRF (No necesario para APIs stateless simples de prueba)
            .csrf(csrf -> csrf.disable())
            // 3. PERMITIR TODO (Lo que pediste: seguridad desactivada)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
        return http.build();
    }

    // Bean auxiliar para definir las reglas de CORS explícitamente
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite cualquier origen (o pon aquí "http://localhost:5173" para ser específico)
        config.setAllowedOriginPatterns(List.of("*")); 
        
        // Permite todos los métodos HTTP (GET, POST, PUT, DELETE, OPTIONS)
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Permite todas las cabeceras (incluyendo Authorization)
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Permite credenciales (cookies, headers de auth)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}