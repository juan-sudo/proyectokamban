package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.application.services.ModuloService;
import com.codigo.msregistro.application.services.SubTareaService;
import com.codigo.msregistro.application.services.TareaService;
import com.codigo.msregistro.domain.aggregates.*;
import jakarta.persistence.EntityNotFoundException;
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

    // ACTUALIZAR POSICION
    @PutMapping("/actualizar-posicion")
    public ResponseEntity<?> actualizarPosicion(
            @PathVariable Long tareaId,  // Captura 'proyectoId' desde la URL
            @RequestParam Long subtareaId,    // Captura 'moduloId' desde la URL
            @RequestParam int idPosicionPoner) {  // 'idPosicionPoner' sigue siendo un parámetro de consulta
        Subtarea proyectoActualizado = subTareaService.moversubTareaAPosicion(tareaId, subtareaId, idPosicionPoner);
        if (proyectoActualizado != null) {
            return ResponseEntity.ok(proyectoActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    //ACTUALIZAR NOMBRE FECHA FIN
    @PatchMapping("/actualizarFechaFin/{subtareaId}")
    public ResponseEntity<?> actualizarSubatreaFechaFin(@PathVariable Long tareaId, @PathVariable Long subtareaId, @RequestBody Subtarea subtarea) {
        Map<String, String> response = new HashMap<>();

        try {
            Subtarea tareaActualizado = subTareaService.actualizarsubTareaFechaFin(tareaId, subtareaId, subtarea);

            response.put("mensaje", "Subtarea actualizado con éxito");
            response.put("id", tareaActualizado.getId().toString());
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (EntityNotFoundException e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);

        } catch (IllegalArgumentException e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            response.put("mensaje", "Error al actualizar el subtarea: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //ACTUALIZAR FECHA INICIO SUBTAREA
    @PatchMapping("/actualizarFechaInicio/{subtareaId}")
    public ResponseEntity<?> actualizarSubatreaFechaInicio(@PathVariable Long tareaId, @PathVariable Long subtareaId, @RequestBody Subtarea subtarea) {
        Map<String, String> response = new HashMap<>();

        try {
            Subtarea tareaActualizado = subTareaService.actualizarsubTareaFechaInicio(tareaId, subtareaId, subtarea);

            response.put("mensaje", "Subtarea actualizado con éxito");
            response.put("id", tareaActualizado.getId().toString());
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (EntityNotFoundException e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);

        } catch (IllegalArgumentException e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            response.put("mensaje", "Error al actualizar el subtarea: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //ACTUALIZAR NOMBRE SUBTAREA
    @PatchMapping("/actualizar/{subtareaId}")
    public ResponseEntity<?> actualizarSubatrea(@PathVariable Long tareaId, @PathVariable Long subtareaId, @RequestBody Subtarea subtarea) {
        Map<String, String> response = new HashMap<>();

        try {
            Subtarea tareaActualizado = subTareaService.actualizarsubTareaNombre(tareaId, subtareaId, subtarea);

            response.put("mensaje", "Subtarea actualizado con éxito");
            response.put("id", tareaActualizado.getId().toString());
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (EntityNotFoundException e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);

        } catch (IllegalArgumentException e) {
            response.put("mensaje", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            response.put("mensaje", "Error al actualizar el módulo: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/delete/{subtareaId}")
    public ResponseEntity<String> deleteTareaByID(@PathVariable Long tareaId, @PathVariable Long subtareaId) {

        log.info("estas aqui");
        // Verifica si el módulo existe
        Optional<Tarea> tareaOp = tareaService.obtenerTareaPorId(tareaId);
        if (!tareaOp.isPresent()) {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no se encuentra el módulo
        }

        // Verifica si la tarea existe
        Optional<Subtarea> tareaOpt = subTareaService.obtenerTareaPorId(subtareaId);
        if (tareaOpt.isPresent()) {
            // Elimina la tarea si existe
            subTareaService.deleteSubTarea(tareaId,subtareaId);
            return ResponseEntity.ok("Subtarea eliminada exitosamente");
        } else {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no se encuentra la tarea
        }
    }

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
            Tarea tarea=tareaOpt.get();
            Subtarea tareaGuardada = subTareaService.crearTarea(tarea,nuevaTarea);
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
