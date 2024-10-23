package com.codigo.msregistro.application.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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



    // Otros métodos para actualizar, eliminar módulos, etc.
}
