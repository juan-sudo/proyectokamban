package com.codigo.msregistro.application.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage()); // Mensaje de error
        response.put("status", String.valueOf(HttpStatus.BAD_REQUEST.value())); // Código de estado
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // Retorna la respuesta en formato JSON
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage()); // Mensaje de error
        response.put("status", String.valueOf(HttpStatus.NOT_FOUND.value())); // Código de estado
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // Retorna la respuesta en formato JSON
    }
    // Otros manejadores de excepciones pueden ir aquí...
}

