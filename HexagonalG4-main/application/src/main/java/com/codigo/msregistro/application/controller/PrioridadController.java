package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.application.services.PrioridadService;
import com.codigo.msregistro.application.services.SubTareaService;
import com.codigo.msregistro.application.services.TareaService;
import com.codigo.msregistro.domain.aggregates.EstadoSubtarea;
import com.codigo.msregistro.domain.aggregates.Prioridad;
import com.codigo.msregistro.domain.aggregates.Subtarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prioridad")
public class PrioridadController {
    @Autowired
    private PrioridadService prioridadService;

    private final Logger log = LoggerFactory.getLogger(PrioridadController.class);


    @PostMapping
    public ResponseEntity<?> crearPrioridad(@Valid @RequestBody Prioridad prioridad, BindingResult result) {
        Map<String, Object> response = new HashMap<>();

        // Check for validation errors
        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            response.put("mensaje", "Error al crear prioridad");
            response.put("errores", errors);
            log.error("Error al crear prioridad: {}", errors);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            // Save the new prioridad
            Prioridad prioridadNueva = prioridadService.crearPrioridad(prioridad);
            response.put("mensaje", "Prioridad creada correctamente");
            response.put("prioridad", prioridadNueva);
            log.info("Prioridad creada: {}", prioridadNueva);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            response.put("mensaje", "Error al crear la prioridad");
            response.put("error", e.getMessage());
            log.error("Excepción al crear la prioridad: {}", e.getMessage(), e);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Prioridad>> allPrioridades() {
        List<Prioridad> prioridades = prioridadService.getALl();

        if (prioridades.isEmpty()) {
            log.info("No hay prioridades registradas.");
            return ResponseEntity.noContent().build();
        } else {
            log.info("Prioridades recuperadas exitosamente: {}", prioridades.size());
            return ResponseEntity.ok(prioridades);
        }
    }



}
