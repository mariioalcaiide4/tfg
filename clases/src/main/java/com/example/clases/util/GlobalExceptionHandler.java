package com.example.clases.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

// @ControllerAdvice (o @RestControllerAdvice) intercepta excepciones de todos los @Controllers
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Captura nuestra excepción personalizada y devuelve un 404 Not Found.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        // Devolvemos un cuerpo simple con el mensaje de error y el estado 404
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * (Opcional pero recomendado)
     * Capturador genérico para cualquier otra excepción que no controlemos.
     * Devuelve un 500 Internal Server Error.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception ex, WebRequest request) {
        // Es buena idea loguear el error completo en el servidor
        // log.error(ex.getMessage(), ex); 
        return new ResponseEntity<>("Ocurrió un error inesperado: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}