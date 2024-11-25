package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.domain.aggregates.EstadoModulo;
import com.codigo.msregistro.domain.aggregates.EstadoProyecto;
import com.codigo.msregistro.domain.aggregates.Modulo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import com.codigo.msregistro.application.services.ProyectoService;
import com.codigo.msregistro.domain.aggregates.Proyecto;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    private final ProyectoService proyectoService;



    //actualizar estado de modulo
    @PutMapping("/{proyectoId}/actualizar-estado")
    public ResponseEntity<?> actualizarEstadoProyecto(@PathVariable Long proyectoId, @RequestParam EstadoProyecto nuevoEstado) {
        Map<String, Object> response = new HashMap<>();

        Optional<Proyecto> tareaOpt = proyectoService.getProyectoById(proyectoId);
        if (tareaOpt.isPresent()) {
            Proyecto modulo = tareaOpt.get();
            modulo.setEstado(nuevoEstado); // Actualizar el estado de la tarea
            Proyecto modululoActualizado = proyectoService.actualizarTarea(modulo);
            return ResponseEntity.ok(modululoActualizado);
        } else {
            return ResponseEntity.notFound().build(); // Si no encuentra la tarea, devolver 404
        }
    }

    //ACTUALIZAR POSICISION
    @PutMapping("/actualizar-posicion")
    public ResponseEntity<Proyecto> actualizarPosicion(@RequestParam Long idProyecto, @RequestParam int idPosicionPoner) {
        Proyecto proyectoActualizado = proyectoService.moverProyectoAPosicion(idProyecto, idPosicionPoner);
        if (proyectoActualizado != null) {
            return ResponseEntity.ok(proyectoActualizado);
        }
        return ResponseEntity.notFound().build();
    }


    //ACTULZIAR FECHA UNICIo

    @PatchMapping("/actualizarFechaInicio/{idProyecto}")
    public ResponseEntity<?> actualizarFechaInicoProyecto(@PathVariable Long idProyecto, @RequestBody Proyecto proyecto) {
        Map<String, String> response = new HashMap<>();

        try {
            Proyecto proyectoActualizado = proyectoService.actualizarFechaInicioProyecto(idProyecto, proyecto);

            if (proyectoActualizado == null) {
                response.put("mensaje", "Proyecto no encontrado con ID: " + idProyecto);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            response.put("mensaje", "Proyecto actualizado con éxito");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("mensaje", "Error al actualizar el proyecto: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Inyección de dependencias a través del constructor
    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @PatchMapping("/{idProyecto}/ampliar/dias={dias}")
    public ResponseEntity<?> actualizarProyecto(@PathVariable Long idProyecto, @PathVariable Long dias) {
        Map<String, String> response = new HashMap<>();

        try {
            Proyecto proyectoActualizado = proyectoService.ampliarFechaProyecto(idProyecto, dias);
            return ResponseEntity.ok(proyectoActualizado);  // Retorna el proyecto actualizado
        } catch (EntityNotFoundException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "Error al actualizar el proyecto: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }






    @PatchMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarNombreProyecto(@PathVariable Long id, @RequestBody Proyecto proyecto) {
        Map<String, String> response = new HashMap<>();

        try {
            Proyecto proyectoActualizado = proyectoService.actualizarNombreProyecto(id, proyecto);

            if (proyectoActualizado == null) {
                response.put("mensaje", "Proyecto no encontrado con ID: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            response.put("mensaje", "Proyecto actualizado con éxito");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("mensaje", "Error al actualizar el proyecto: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Obtener todos los proyectos (no eliminados)
    @GetMapping
    public ResponseEntity<List<Proyecto>> getProyectos() {
        List<Proyecto> proyectos = proyectoService.getAllProyectos();
        if (proyectos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Retorna 204 si no hay proyectos
        }
        return new ResponseEntity<>(proyectos, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<Proyecto>> getProyectosSin() {
        List<Proyecto> proyectos = proyectoService.getAllProyectos();

        // Filtrar proyectos que tienen al menos un módulo
        List<Proyecto> proyectosConModulos = proyectos.stream()
                .filter(proyecto -> proyecto.getModulos() != null && !proyecto.getModulos().isEmpty())
                .collect(Collectors.toList());

        if (proyectosConModulos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Retorna 204 si no hay proyectos con módulos
        }
        return new ResponseEntity<>(proyectosConModulos, HttpStatus.OK);
    }


    // Obtener todos los proyectos que están en la papelera
    @GetMapping("/papelera")
    public ResponseEntity<List<Proyecto>> getProyectosEnPapelera() {
        List<Proyecto> proyectosEnPapelera = proyectoService.getProyectosEnPapelera();
        if (proyectosEnPapelera.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(proyectosEnPapelera, HttpStatus.OK);
    }

    // Obtener un proyecto por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> getProyectoById(@PathVariable Long id) {
        Optional<Proyecto> proyecto = proyectoService.getProyectoById(id);
        return proyecto.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Crear un nuevo proyecto
    @PostMapping
    public ResponseEntity<Proyecto> createProyecto(@RequestBody Proyecto proyecto) {
        Proyecto nuevoProyecto = proyectoService.createProyecto(proyecto);
        return new ResponseEntity<>(nuevoProyecto, HttpStatus.CREATED);
    }




    //LiSTAR PROYECTOS ELIMINADOS
    @GetMapping("/eliminados")
    public List<Proyecto> obtenerProyectosEliminados() {
        return proyectoService.listarProyectosElimindos();
    }
    // RESTAURAR DE PAPELERA
    @PatchMapping("/{id}/restaurar-papelera")
    public ResponseEntity<?> restaurarProyectoDePapelera(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        boolean restaurado = proyectoService.restaurarProyecto(id);
        if (restaurado) {
            response.put("mensaje", "El proyecto  se ha restaurado correctamente.");
            return ResponseEntity.ok(response);

        } else {
            response.put("error", "Proyecto no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    // Mover un proyecto a la papelera (eliminación lógica)
    @PatchMapping("/{id}/eliminar")
    public ResponseEntity<Map<String, String>> eliminarProyecto(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        boolean eliminado = proyectoService.eliminarProyecto(id);
        if (eliminado) {
            response.put("mensaje", "El proyecto ha sido movido a la papelera correctamente.");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Proyecto no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //LISAT DE PROYECTOS NO ARCHIVADOS

    @GetMapping("/no-archivados")
    public List<Proyecto> obtenerProyectosNoArchivados() {
        return proyectoService.listarProyectosNoArchivados();
    }


    //LISTA DE PROYETOSARCHIVADOS

    @GetMapping("/archivados")
    public List<Proyecto> obtenerProyectosArchivados() {
        return proyectoService.listarProyectosArchivados();
    }

    // Endpoint para cambiar el estado de un proyecto
    @PutMapping("/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstadoProyecto(
            @PathVariable Long id,
            @RequestParam EstadoProyecto nuevoEstado) {

        Map<String, String> response = new HashMap<>();
        boolean actualizado = proyectoService.cambiarEstadoProyecto(id, nuevoEstado);

        if (actualizado) {
            response.put("mensaje", "El proyecto se ha archivado correctamente.");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Proyecto no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

//RESAURAR DE ARCHIVADO
    @PutMapping("/{id}/restaurar")
    public ResponseEntity<?> restaurarDeArchivado(@PathVariable Long id) {
        Map<Object, String> response = new HashMap<>();

        boolean actualizado = proyectoService.restaurarProyectoNoArchivado(id);

        if (actualizado) {
            response.put("mensaje", "El proyecto ha sido restaurado correctamente.");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Proyecto no encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }






    @PutMapping("/{id}/usuarios")
    public ResponseEntity<Proyecto> actualizarUsuarios(
            @PathVariable("id") Long proyectoId,
            @RequestBody List<Long> nuevosUsuarioIds) {  // Cambiar de List<Usuario> a List<Long>
        Proyecto proyectoActualizado = proyectoService.actualizarUsuarios(proyectoId, nuevosUsuarioIds);
        return ResponseEntity.ok(proyectoActualizado);
    }

    @DeleteMapping("/{proyectoId}/usuarios/{usuarioId}")
    public ResponseEntity<Proyecto> eliminarUsuarioDeProyecto(
            @PathVariable Long proyectoId,
            @PathVariable Long usuarioId) {
        Proyecto proyectoActualizado = proyectoService.eliminarUsuarioDeProyecto(proyectoId, usuarioId);
        return ResponseEntity.ok(proyectoActualizado);
    }

    @PutMapping("/{idProyecto}/prioridad/{idPrioridad}")
    public ResponseEntity<Proyecto> actualizarPrioridadConId(
            @PathVariable("idProyecto") Long proyectoId,
            @PathVariable("idPrioridad") Long idPrioridad) {
        Proyecto proyectoActualizado = proyectoService.actualizarPrioridad(proyectoId, idPrioridad);
        return ResponseEntity.ok(proyectoActualizado);
    }

    @PutMapping("/{idProyecto}/prioridad")
    public ResponseEntity<Proyecto> actualizarPrioridadSinId(
            @PathVariable("idProyecto") Long proyectoId) { // Sin idPrioridad
        Proyecto proyectoActualizado = proyectoService.actualizarPrioridad(proyectoId, null);
        return ResponseEntity.ok(proyectoActualizado);
    }







}
