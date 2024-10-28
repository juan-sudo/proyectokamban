package com.codigo.msregistro.application.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Proyecto;
import com.codigo.msregistro.application.services.ModuloService;
import com.codigo.msregistro.application.services.ProyectoService;

@RestController
@RequestMapping("/api/proyectos/{proyectoId}/modulos")
@CrossOrigin(origins = "*")
public class ModuloController {

    private final ModuloService moduloService;
    private final ProyectoService proyectoService;

    public ModuloController(ModuloService moduloService, ProyectoService proyectoService) {
        this.moduloService = moduloService;
        this.proyectoService = proyectoService;
    }

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



    // Otros métodos para actualizar, eliminar módulos, etc.
}
