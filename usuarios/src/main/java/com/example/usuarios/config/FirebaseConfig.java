package com.example.usuarios.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    /**
     * Este Bean se crea al arrancar la aplicación.
     * Lee el archivo JSON de 'resources' y se conecta con Firebase.
     */
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        
        // Comprueba si la app ya está inicializada (evita errores en recargas)
        if (FirebaseApp.getApps().isEmpty()) {
            
            // Carga el archivo JSON que guardamos en 'resources'
            InputStream serviceAccount = new ClassPathResource("firebase_service_account.json").getInputStream();

            // Configura las opciones de Firebase
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // Inicializa la app de Firebase
            return FirebaseApp.initializeApp(options);
        } else {
            // Si ya está inicializada, simplemente devuelve la instancia
            return FirebaseApp.getInstance();
        }
    }
}