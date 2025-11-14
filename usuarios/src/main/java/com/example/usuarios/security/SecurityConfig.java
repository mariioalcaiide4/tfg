package com.example.usuarios.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Inyectamos nuestro filtro personalizado de Firebase (lo creamos ahora)
    private final FirebaseTokenFilter firebaseTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitamos CSRF (común en APIs REST)
            .csrf(csrf -> csrf.disable()) 
            
            // Le decimos a Spring que no cree sesiones (usamos tokens)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Definimos los permisos de nuestras rutas (endpoints)
            .authorizeHttpRequests(authz -> authz
                // Damos permiso PÚBLICO al endpoint de "sincronización"
                // El frontend llamará aquí JUSTO después de registrarse en Firebase
                .requestMatchers(HttpMethod.POST, "/api/usuarios/sincronizar").permitAll()
                
                // (Opcional) Damos permiso público a Swagger/OpenAPI si lo usas
                // .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                
                // Cualquier otra petición (ej: /api/usuarios/me) debe estar autenticada
                .anyRequest().authenticated()
            )
            
            // Añadimos nuestro filtro (FirebaseTokenFilter) ANTES del filtro normal
            .addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}