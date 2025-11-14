package com.example.usuarios.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j // Para logs
public class FirebaseTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Obtenemos la cabecera "Authorization"
        String authHeader = request.getHeader("Authorization");

        // 2. Comprobamos si es un token "Bearer"
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Si no es, dejamos que Spring siga (y probablemente falle si la ruta es protegida)
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraemos el token
        String token = authHeader.substring(7); // Quitamos "Bearer "

        try {
            // 4. ¡LA MAGIA! Usamos el SDK de Firebase Admin para verificar el token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            
            // 5. Si es válido, obtenemos el UID (el id de Firebase)
            String uid = decodedToken.getUid();
            
            // 6. Creamos un "UserDetails" de Spring Security.
            //    Aquí, el "username" es el UID de Firebase.
            //    No necesitamos roles aquí porque los gestionamos en la BD,
            //    pero podrías añadirlos si los configuras en Firebase (Custom Claims).
            UserDetails userDetails = User.builder()
                    .username(uid) // ¡¡El username es el UID de Firebase!!
                    .password("") // La contraseña no importa
                    .authorities(new ArrayList<>()) // Lista de roles vacía por ahora
                    .build();

            // 7. Creamos la "sesión" de autenticación de Spring
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            // 8. Establecemos la autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            // Si el token es inválido (expirado, malformado, etc.)
            log.error("Error al verificar el token de Firebase: {}", e.getMessage());
            // Limpiamos el contexto de seguridad
            SecurityContextHolder.clearContext();
            
            // (Opcional) Devolvemos un error 401 (No autorizado)
            // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token de Firebase inválido");
            // return; // Si descomentas esto, la petición se corta aquí
        }

        // 9. Pase lo que pase, continuamos con el siguiente filtro
        filterChain.doFilter(request, response);
    }
}