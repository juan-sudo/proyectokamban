package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.application.services.ModuloService;
import com.codigo.msregistro.application.services.SubTareaService;
import com.codigo.msregistro.application.services.TareaService;
import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Subtarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
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
}
