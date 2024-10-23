package com.codigo.msregistro.domain.impl;

import com.codigo.msregistro.domain.aggregates.Proyecto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service("proyectoServiceImpl")
public class ProyectoService {

    // Simulando una base de datos con una lista
    private List<Proyecto> proyectos = new ArrayList<>();

    // Obtener todos los proyectos (incluyendo los no eliminados)
    public List<Proyecto> getAllProyectos() {
        List<Proyecto> proyectosActivos = new ArrayList<>();
        for (Proyecto proyecto : proyectos) {
            if (!proyecto.getEliminado()) {
                proyectosActivos.add(proyecto);  // Solo agregar proyectos no eliminados
            }
        }
        return proyectosActivos;
    }

    // Crear un nuevo proyecto
    public Proyecto createProyecto(Proyecto proyecto) {
        proyectos.add(proyecto);
        return proyecto;
    }

    // Mover proyecto a la papelera (eliminación lógica)
    public Optional<Proyecto> moverAPapelera(Long id) {
        for (Proyecto proyecto : proyectos) {
            if (proyecto.getId().equals(id) && !proyecto.getEliminado()) {
                proyecto.setEliminado(true);  // Marcar el proyecto como eliminado
                return Optional.of(proyecto);
            }
        }
        return Optional.empty();  // Retornar vacío si no se encuentra el proyecto
    }

    // Restaurar un proyecto desde la papelera
    public Optional<Proyecto> restaurarProyecto(Long id) {
        for (Proyecto proyecto : proyectos) {
            if (proyecto.getId().equals(id) && proyecto.getEliminado()) {
                proyecto.setEliminado(false);  // Restaurar el proyecto
                return Optional.of(proyecto);
            }
        }
        return Optional.empty();  // Retornar vacío si no se encuentra el proyecto
    }

    // Eliminar definitivamente un proyecto
    public boolean eliminarDefinitivamente(Long id) {
        return proyectos.removeIf(proyecto -> proyecto.getId().equals(id) && proyecto.getEliminado());  // Eliminar solo si está en la papelera
    }

    // Obtener proyectos en la papelera
    public List<Proyecto> getProyectosEnPapelera() {
        List<Proyecto> proyectosEnPapelera = new ArrayList<>();
        for (Proyecto proyecto : proyectos) {
            if (proyecto.getEliminado()) {
                proyectosEnPapelera.add(proyecto);  // Agregar solo los que están en la papelera
            }
        }
        return proyectosEnPapelera;
    }
}
