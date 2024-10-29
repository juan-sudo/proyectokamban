package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.EstadoProyecto;
import com.codigo.msregistro.domain.aggregates.Prioridad;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.codigo.msregistro.domain.aggregates.Proyecto;
import com.codigo.msregistro.infraestructure.repositories.ProyectoRepository;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;

    private final UsuarioRepository usuarioRepository;

    private final PrioridadRepository prioridadRepository;

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
        // Ordenar los proyectos no archivados en orden descendente
        return proyectoRepository.findByEstadoNot(EstadoProyecto.ARCHIVADO, Sort.by(Sort.Direction.DESC, "id")); // Cambia "id" por el campo que desees
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






    public Proyecto actualizarUsuarios(Long proyectoId, List<Long> nuevosUsuarioIds) {
        // Buscar el proyecto por ID, lanzando una excepción si no se encuentra
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));

        // Limpiar la lista de usuarios existente (opcional)
        proyecto.getUsuarios().clear();

        // Obtener los usuarios a partir de los IDs
        List<Usuario> nuevosUsuarios = usuarioRepository.findAllById(nuevosUsuarioIds);

        // Comprobar si se encontraron usuarios válidos
        if (nuevosUsuarios.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron usuarios con los IDs proporcionados");
        }

        // Agregar los nuevos usuarios al proyecto
        proyecto.getUsuarios().addAll(nuevosUsuarios);

        // Guardar el proyecto actualizado
        return proyectoRepository.save(proyecto);
    }

    public Proyecto eliminarUsuarioDeProyecto(Long proyectoId, Long usuarioId) {
        // Buscar el proyecto por su ID, lanzando una excepción si no se encuentra
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto con ID " + proyectoId + " no encontrado"));

        // Filtrar la lista de usuarios para eliminar el usuario con el ID especificado
        boolean usuarioEliminado = proyecto.getUsuarios().removeIf(usuario -> usuario.getId().equals(usuarioId));

        // Verificar si el usuario estaba en la lista del proyecto
        if (!usuarioEliminado) {
            throw new ResourceNotFoundException("Usuario con ID " + usuarioId + " no encontrado en el proyecto");
        }

        // Guardar el proyecto actualizado
        return proyectoRepository.save(proyecto);
    }

    public Proyecto actualizarPrioridad(Long proyectoId, Long prioridadId) {
        // Buscar el proyecto por ID, lanzando una excepción si no se encuentra
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));

        if (prioridadId == null) {
            // Si prioridadId es null, asignar null a la prioridad del proyecto
            proyecto.setPrioridad(null);
        } else {
            // Obtener la nueva prioridad a partir del ID
            Prioridad nuevaPrioridad = prioridadRepository.findById(prioridadId)
                    .orElseThrow(() -> new ResourceNotFoundException("Prioridad no encontrada"));

            // Asignar la nueva prioridad
            proyecto.setPrioridad(nuevaPrioridad);
        }

        // Guardar el proyecto actualizado
        return proyectoRepository.save(proyecto);
    }





}

