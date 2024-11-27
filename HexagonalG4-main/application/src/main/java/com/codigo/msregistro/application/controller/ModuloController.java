package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.domain.aggregates.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.codigo.msregistro.application.services.ModuloService;
import com.codigo.msregistro.application.services.ProyectoService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/proyectosmodulo/{proyectoId}/modulos")
public class ModuloController {

    private final ModuloService moduloService;
    private final ProyectoService proyectoService;




    // ACTUALIZAR POSICION
    @PutMapping("/actualizar-posicion")
    public ResponseEntity<Modulo> actualizarPosicion(
            @PathVariable Long proyectoId,  // Captura 'proyectoId' desde la URL
            @RequestParam Long moduloId,    // Captura 'moduloId' desde la URL
            @RequestParam int idPosicionPoner) {  // 'idPosicionPoner' sigue siendo un parámetro de consulta
        Modulo proyectoActualizado = moduloService.moverProyectoAPosicion(proyectoId, moduloId, idPosicionPoner);
        if (proyectoActualizado != null) {
            return ResponseEntity.ok(proyectoActualizado);
        }
        return ResponseEntity.notFound().build();
    }


    //actualizar estado de modulo
    @PutMapping("/{moduloId}/estado")
    public ResponseEntity<?> actualizarEstadoTarea(@PathVariable Long proyectoId, @PathVariable Long moduloId, @RequestParam EstadoModulo nuevoEstado) {
        Map<String, Object> response = new HashMap<>();

        Optional<Proyecto> moduloOpt = proyectoService.getProyectoById(proyectoId);
        if (!moduloOpt.isPresent()) {
            return ResponseEntity.notFound().build(); // Si no encuentra el módulo, devolver 404
        }

        Optional<Modulo> tareaOpt = moduloService.obtenerModuloPorId(moduloId);
        if (tareaOpt.isPresent()) {
            Modulo modulo = tareaOpt.get();
            modulo.setEstado(nuevoEstado); // Actualizar el estado de la tarea
            Modulo modululoActualizado = moduloService.actualizarTarea(modulo);
            return ResponseEntity.ok(modululoActualizado);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra la tarea, devolver 404
        }
    }

    @PatchMapping("/actualizarFechaFin/{moduloId}")
    public ResponseEntity<?> actualizarFechaInicioModuloFin(@PathVariable Long proyectoId, @PathVariable Long moduloId, @RequestBody Modulo modulo) {
        Map<String, String> response = new HashMap<>();

        try {
            Modulo moduloActualizado = moduloService.actualizarFechaInicioModuloFin(proyectoId, moduloId, modulo);

            response.put("mensaje", "Módulo fecha inicio actualizado con éxito");
            response.put("id", moduloActualizado.getId().toString());
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


    @PatchMapping("/actualizarFechaInicio/{moduloId}")
    public ResponseEntity<?> actualizarFechaInicioModuloInicio(@PathVariable Long proyectoId, @PathVariable Long moduloId, @RequestBody Modulo modulo) {
        Map<String, String> response = new HashMap<>();

        try {
            Modulo moduloActualizado = moduloService.actualizarFechaInicioModulo(proyectoId, moduloId, modulo);

            response.put("mensaje", "Módulo fecha inicio actualizado con éxito");
            response.put("id", moduloActualizado.getId().toString());
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




    @DeleteMapping("/delete/{idModulo}")
    public ResponseEntity<?> deleteModuloByID(@PathVariable Long proyectoId, @PathVariable Long idModulo) {
        Map<String, String> response = new HashMap<>();

        String resultMessage = moduloService.deleteModulo(proyectoId, idModulo);

        if (resultMessage.contains("no existe")) {
            response.put("error", resultMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            response.put("mensaje", resultMessage);
            return ResponseEntity.ok(response);
        }
    }



    @PatchMapping("/actualizar/{moduloId}")
    public ResponseEntity<?> actualizarModulo(@PathVariable Long proyectoId, @PathVariable Long moduloId, @RequestBody Modulo modulo) {
        Map<String, String> response = new HashMap<>();

        try {
            Modulo moduloActualizado = moduloService.actualizarModulo(proyectoId, moduloId, modulo);

            response.put("mensaje", "Módulo actualizado con éxito");
            response.put("id", moduloActualizado.getId().toString());
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


//CREAR MODULO
    @PostMapping
    public ResponseEntity<Modulo> crearModulo(@PathVariable Long proyectoId, @RequestBody Modulo modulo) {
        Optional<Proyecto> proyectoOpt = proyectoService.getProyectoById(proyectoId);
        if (proyectoOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();
            Modulo nuevoModulo = moduloService.crearModulo(proyecto, modulo);
            return new ResponseEntity<>(nuevoModulo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 si el proyecto no existe
        }
    }

    @GetMapping("/{moduloId}")
    public ResponseEntity<Modulo> obtenerModulo(@PathVariable Long proyectoId, @PathVariable Long moduloId) {
        Optional<Modulo> moduloOpt = moduloService.obtenerModuloPorId(moduloId);
        if (moduloOpt.isPresent()) {
            return new ResponseEntity<>(moduloOpt.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 si no encuentra el módulo
        }
    }

    @PutMapping("/{id}/usuarios")
    public ResponseEntity<Modulo> actualizarUsuarios(
            @PathVariable("id") Long moduloId,
            @RequestBody List<Long> nuevosUsuarioIds) {  // Cambiar de List<Usuario> a List<Long>
        Modulo moduloActualizado = moduloService.actualizarUsuarios(moduloId, nuevosUsuarioIds);
        return ResponseEntity.ok(moduloActualizado);
    }

    @DeleteMapping("/{moduloId}/usuarios/{usuarioId}")
    public ResponseEntity<Modulo> eliminarUsuarioDeModulo(
            @PathVariable Long moduloId,
            @PathVariable Long usuarioId) {
        Modulo moduloActuzalizado = moduloService.eliminarUsuarioDeModulo(moduloId, usuarioId);
        return ResponseEntity.ok(moduloActuzalizado);
    }


    @PutMapping("/{idModulo}/prioridad/{idPrioridad}")
    public ResponseEntity<Modulo> actualizarPrioridadConId(
            @PathVariable("proyectoId") Long proyectoId,  // Cambiado de "idProyecto" a "proyectoId"
            @PathVariable("idModulo") Long idModulo,
            @PathVariable("idPrioridad") Long idPrioridad) {
        Modulo moduloActualizado = moduloService.actualizarPrioridad(proyectoId, idModulo, idPrioridad);
        return ResponseEntity.ok(moduloActualizado);
    }


    @PutMapping("/{idModulo}/prioridad")
    public ResponseEntity<Modulo> actualizarPrioridadSinId(
            @PathVariable("idModulo") Long idModulo,
            @PathVariable("proyectoId") Long proyectoId) { // Sin idPrioridad
        Modulo moduloActualizado = moduloService.actualizarPrioridad(proyectoId, idModulo, null);
        return ResponseEntity.ok(moduloActualizado);
    }



    // Otros métodos para actualizar, eliminar módulos, etc.
}
