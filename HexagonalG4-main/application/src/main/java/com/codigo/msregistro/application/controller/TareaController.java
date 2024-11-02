package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.application.services.TareaService;
import com.codigo.msregistro.domain.aggregates.EstadoTarea;
import com.codigo.msregistro.domain.aggregates.Proyecto;
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

    @PutMapping("/actualizar/{tareaId}")
    public ResponseEntity<?> updateTarea(@RequestBody Tarea tarea, @PathVariable Long tareaId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Tarea tareaActualizada = tareaService.actualizarTarea(tareaId, tarea);
            response.put("message", "Tarea actualizada exitosamente");
            response.put("tarea", tareaActualizada);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            response.put("message", "Error: No se encontró la tarea con ID " + tareaId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("message", "Error al actualizar la tarea");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @DeleteMapping("/delete/{idTarea}")
    public ResponseEntity<String> deleteTareaByID(@PathVariable Long moduloId, @PathVariable Long idTarea) {

        log.info("estas aqui");
        // Verifica si el módulo existe
        Optional<Modulo> moduloOpt = moduloService.obtenerModuloPorId(moduloId);
        if (!moduloOpt.isPresent()) {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no se encuentra el módulo
        }

        // Verifica si la tarea existe
        Optional<Tarea> tareaOpt = tareaService.obtenerTareaPorId(idTarea);
        if (tareaOpt.isPresent()) {
            // Elimina la tarea si existe
            tareaService.deleteTarea(idTarea);
            return ResponseEntity.ok("Tarea eliminada exitosamente");
        } else {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no se encuentra la tarea
        }
    }

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


    @PutMapping("/{id}/usuarios")
    public ResponseEntity<Tarea> actualizarUsuarios(
            @PathVariable("id") Long moduloId,
            @RequestBody List<Long> nuevosUsuarioIds) {  // Cambiar de List<Usuario> a List<Long>
        Tarea moduloActualizado = tareaService.actualizarUsuarios(moduloId, nuevosUsuarioIds);
        return ResponseEntity.ok(moduloActualizado);
    }

    @DeleteMapping("/{tareaId}/usuarios/{usuarioId}")
    public ResponseEntity<Tarea> eliminarUsuarioDeModulo(
            @PathVariable Long tareaId,
            @PathVariable Long usuarioId) {
        Tarea moduloActuzalizado = tareaService.eliminarUsuarioDeModulo(tareaId, usuarioId);
        return ResponseEntity.ok(moduloActuzalizado);
    }

    @PutMapping("/{idTarea}/prioridad/{idPrioridad}")
    public ResponseEntity<Tarea> actualizarPrioridadConId(
            @PathVariable("idTarea") Long idTarea,
            @PathVariable("idPrioridad") Long idPrioridad,
            @PathVariable("moduloId") Long moduloId) {
        Tarea tareaactualizada = tareaService.actualizarPrioridad(moduloId,idTarea, idPrioridad);
        return ResponseEntity.ok(tareaactualizada);
    }

    @PutMapping("/{tareaId}/prioridad")
    public ResponseEntity<Tarea> actualizarPrioridadSinId(
            @PathVariable("tareaId") Long idTarea,
            @PathVariable("moduloId") Long moduloId) { // Sin idPrioridad
        Tarea proyectoActualizado = tareaService.actualizarPrioridad(moduloId,idTarea,null);
        return ResponseEntity.ok(proyectoActualizado);
    }



}
