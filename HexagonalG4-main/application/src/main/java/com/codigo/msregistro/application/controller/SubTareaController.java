package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.application.services.ModuloService;
import com.codigo.msregistro.application.services.SubTareaService;
import com.codigo.msregistro.application.services.TareaService;
import com.codigo.msregistro.domain.aggregates.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tareas/{tareaId}/subTareas")
public class SubTareaController {

    @Autowired
    private TareaService tareaService;

    @Autowired
    private SubTareaService subTareaService;

    private final Logger log = LoggerFactory.getLogger(SubTareaController.class);

    @PutMapping("/{idSubtarea}")
    public ResponseEntity<?> crearSubTarea(@Valid @PathVariable Long tareaId,
                                           @PathVariable Long idSubtarea,
                                           @RequestBody Subtarea nuevaTarea) {
        Map<String, Object> response = new HashMap<>();

        Optional<Tarea> tareaOpt = tareaService.obtenerTareaPorId(tareaId);
        if (tareaOpt.isPresent()) {
            nuevaTarea.setTarea(tareaOpt.get()); // Asignar el módulo a la tarea
            Subtarea tareaGuardada = subTareaService.actualizarSubtarea(idSubtarea, nuevaTarea);

            response.put("mensaje", "Subtarea actualizada exitosamente");
            response.put("subtarea", tareaGuardada);

            return ResponseEntity.ok(response);
        } else {
            response.put("mensaje", "Tarea no encontrada con ID: " + tareaId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // Si no encuentra la tarea, devolver 404
        }
    }

    // Crear una nueva tarea en un módulo
    @PostMapping
    public ResponseEntity<?> crearSubTarea(@Valid @PathVariable Long tareaId, @RequestBody Subtarea nuevaTarea, BindingResult result) {

        Map<String, Object> response = new HashMap<>();

        if( result.hasErrors() ) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El campo: '" + err.getField() + "' " + err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);

        }
        //System.out.println(nuevaTarea.getFechaFin());

        Optional<Tarea> tareaOpt = tareaService.obtenerTareaPorId(tareaId);
        if (tareaOpt.isPresent()) {
            nuevaTarea.setTarea(tareaOpt.get()); // Asignar el módulo a la tarea
            Subtarea tareaGuardada = subTareaService.crearTarea(nuevaTarea);
            return ResponseEntity.ok(tareaGuardada);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra el módulo, devolver 404
        }


    }

    // Obtener todas las tareas de un módulo específico
    @GetMapping
    public ResponseEntity<List<Subtarea>> obtenerSubTareasPorTarea(@PathVariable Long moduloId) {
        Optional<Tarea> subtareOp = tareaService.obtenerTareaPorId(moduloId);
        if (subtareOp.isPresent()) {
            List<Subtarea> tareas = subTareaService.obtenerTareasPorModulo(subtareOp.get());
            return ResponseEntity.ok(tareas);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra el módulo, devolver 404
        }
    }

    @PutMapping("/{subtareaId}/estado")
    public ResponseEntity<?> actualizarEstadoTarea(@PathVariable Long tareaId, @PathVariable Long subtareaId, @RequestParam EstadoSubtarea nuevoEstado) {
        Map<String, Object> response = new HashMap<>();

        Optional<Tarea> moduloOpt = tareaService.obtenerTareaPorId(tareaId);
        if (!moduloOpt.isPresent()) {
            return ResponseEntity.notFound().build(); // Si no encuentra el módulo, devolver 404
        }

        Optional<Subtarea> tareaOpt = subTareaService.obtenerTareaPorId(subtareaId);
        if (tareaOpt.isPresent()) {
            Subtarea tarea = tareaOpt.get();
            tarea.setEstado(nuevoEstado); // Actualizar el estado de la tarea
            Subtarea tareaActualizada = subTareaService.actualizarTarea(tarea);
            return ResponseEntity.ok(tareaActualizada);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra la tarea, devolver 404
        }
    }

    @PutMapping("/{subtareaid}/usuarios")
    public ResponseEntity<Subtarea> actualizarUsuarios(
            @PathVariable("subtareaid") Long moduloId,
            @RequestBody List<Long> nuevosUsuarioIds) {
        Subtarea subateraActializado = subTareaService.actualizarUsuarios(moduloId, nuevosUsuarioIds);
        return ResponseEntity.ok(subateraActializado);
    }

    @DeleteMapping("/{subtareaId}/usuarios/{usuarioId}")
    public ResponseEntity<Subtarea> eliminarUsuarioDeModulo(
            @PathVariable Long subtareaId,
            @PathVariable Long usuarioId) {
        Subtarea subateraActializado = subTareaService.eliminarUsuarioDeModulo(subtareaId, usuarioId);
        return ResponseEntity.ok(subateraActializado);
    }

    @PutMapping("/{idSubtarea}/prioridad/{idPrioridad}")
    public ResponseEntity<Subtarea> actualizarPrioridadConId(
            @PathVariable("idSubtarea") Long idSubtarea,
            @PathVariable("idPrioridad") Long idPrioridad,
            @PathVariable("tareaId") Long tareaId) {
        Subtarea subtareaactualizada = subTareaService.actualizarPrioridad(tareaId,idSubtarea, idPrioridad);
        return ResponseEntity.ok(subtareaactualizada);
    }

    @PutMapping("/{idSubtarea}/prioridad")
    public ResponseEntity<Subtarea> actualizarPrioridadSinId(
            @PathVariable("idSubtarea") Long idSubtarea,
            @PathVariable("tareaId") Long tareaId) { // Sin idPrioridad
        Subtarea subtareaActualizado = subTareaService.actualizarPrioridad(tareaId,idSubtarea,null);
        return ResponseEntity.ok(subtareaActualizado);
    }


}
