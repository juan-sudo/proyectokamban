package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.application.services.TareaService;
import com.codigo.msregistro.domain.aggregates.EstadoTarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.application.services.ModuloService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/modulos/{moduloId}/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @Autowired
    private ModuloService moduloService;

    private final Logger log = LoggerFactory.getLogger(TareaController.class);
    // Crear una nueva tarea en un módulo
    @PostMapping
    public ResponseEntity<?> crearTarea(@Valid @PathVariable Long moduloId, @RequestBody Tarea nuevaTarea, BindingResult result) {

        Map<String, Object> response = new HashMap<>();

        if( result.hasErrors() ) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El campo: '" + err.getField() + "' " + err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);

        }
        System.out.println(nuevaTarea.getFechaFin());

        Optional<Modulo> moduloOpt = moduloService.obtenerModuloPorId(moduloId);
        if (moduloOpt.isPresent()) {
            nuevaTarea.setModulo(moduloOpt.get()); // Asignar el módulo a la tarea
            Tarea tareaGuardada = tareaService.crearTarea(nuevaTarea);
            return ResponseEntity.ok(tareaGuardada);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra el módulo, devolver 404
        }


    }

    // Obtener todas las tareas de un módulo específico
    @GetMapping
    public ResponseEntity<List<Tarea>> obtenerTareasPorModulo(@PathVariable Long moduloId) {
        Optional<Modulo> moduloOpt = moduloService.obtenerModuloPorId(moduloId);
        if (moduloOpt.isPresent()) {
            List<Tarea> tareas = tareaService.obtenerTareasPorModulo(moduloOpt.get());
            return ResponseEntity.ok(tareas);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra el módulo, devolver 404
        }
    }

    //actualizar estado de tarea
    @PutMapping("/{tareaId}/estado")
    public ResponseEntity<?> actualizarEstadoTarea(@PathVariable Long moduloId, @PathVariable Long tareaId, @RequestParam EstadoTarea nuevoEstado) {
        Map<String, Object> response = new HashMap<>();

        Optional<Modulo> moduloOpt = moduloService.obtenerModuloPorId(moduloId);
        if (!moduloOpt.isPresent()) {
            return ResponseEntity.notFound().build(); // Si no encuentra el módulo, devolver 404
        }

        Optional<Tarea> tareaOpt = tareaService.obtenerTareaPorId(tareaId);
        if (tareaOpt.isPresent()) {
            Tarea tarea = tareaOpt.get();
            tarea.setEstado(nuevoEstado); // Actualizar el estado de la tarea
            Tarea tareaActualizada = tareaService.actualizarTarea(tarea);
            return ResponseEntity.ok(tareaActualizada);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra la tarea, devolver 404
        }
    }
    @GetMapping("/{tareaId}")
    public ResponseEntity<?> obtenerTareaPorId(@PathVariable Long moduloId, @PathVariable Long tareaId) {
        try {

            Optional<Tarea> tareaOpt = tareaService.obtenerTareaPorId(tareaId);
            if (!tareaOpt.isPresent()) {
                log.error("Tarea no encontrada con ID: " + tareaId);
                return ResponseEntity.notFound().build(); // Si no encuentra la tarea, devolver 404
            }

            return ResponseEntity.ok(tareaOpt.get());
        } catch (Exception e) {
            log.error("Error al obtener la tarea", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }


}
