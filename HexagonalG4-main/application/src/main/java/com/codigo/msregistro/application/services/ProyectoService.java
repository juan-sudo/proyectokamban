package com.codigo.msregistro.application.services;

import com.codigo.msregistro.domain.aggregates.EstadoProyecto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.codigo.msregistro.domain.aggregates.Proyecto;
import com.codigo.msregistro.infraestructure.repositories.ProyectoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;

    @Autowired
    public ProyectoService(ProyectoRepository proyectoRepository) {
        this.proyectoRepository = proyectoRepository;
    }

    // Obtener todos los proyectos no eliminados
    public List<Proyecto> getAllProyectos() {
        return proyectoRepository.findByEliminadoFalse();  // Busca los proyectos no eliminados
    }

    // Obtener los proyectos que están en la papelera
    public List<Proyecto> getProyectosEnPapelera() {
        return proyectoRepository.findByEliminadoTrue();  // Busca los proyectos en la papelera
    }

    // Obtener un proyecto por su ID
    public Optional<Proyecto> getProyectoById(Long id) {
        return proyectoRepository.findById(id);
    }

    // Crear un nuevo proyecto
    public Proyecto createProyecto(Proyecto proyecto) {
        proyecto.setEstado(EstadoProyecto.PENDIENTE);

        return proyectoRepository.save(proyecto);
    }

    // Eliminar un proyecto (moverlo a la papelera)
    public boolean eliminarProyecto(Long id) {
        Optional<Proyecto> proyecto = proyectoRepository.findById(id);
        if (proyecto.isPresent()) {
            Proyecto p = proyecto.get();
            p.moverAPapelera();
            proyectoRepository.save(p);
            return true;
        }
        return false;
    }

    // Restaurar un proyecto desde la papelera
    public boolean restaurarProyecto(Long id) {
        Optional<Proyecto> proyecto = proyectoRepository.findById(id);
        if (proyecto.isPresent()) {
            Proyecto p = proyecto.get();
            p.restaurarDePapelera();
            proyectoRepository.save(p);
            return true;
        }
        return false;
    }


    public List<Proyecto> listarProyectosNoArchivados() {
        return proyectoRepository.findByEstadoNot(EstadoProyecto.ARCHIVADO);
    }

    public List<Proyecto> listarProyectosArchivados() {
        return proyectoRepository.findByEstado(EstadoProyecto.ARCHIVADO);
    }

    // Método para cambiar el estado de un proyecto
    public boolean cambiarEstadoProyecto(Long id, EstadoProyecto nuevoEstado) {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(id);

        if (proyectoOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();
            proyecto.setEstado(nuevoEstado);  // Actualizar el estado del proyecto
            proyectoRepository.save(proyecto);  // Guardar los cambios
            return true;
        }

        return false;  // Si el proyecto no existe, devolver false
    }
}
