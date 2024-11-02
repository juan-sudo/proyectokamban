package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.ModuloRepository;
import com.codigo.msregistro.infraestructure.repositories.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.TareaRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
    @RequiredArgsConstructor
    public class TareaService {

        private final TareaRepository tareaRepository;
        private final UsuarioRepository usuarioRepository;
        private final PrioridadRepository prioridadRepository;
        private final ModuloRepository moduloRepository;

    public String deleteTarea(Long id) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea con ID " + id + " no encontrada"));

        tareaRepository.delete(tarea);
        return "Tarea eliminada exitosamente";
    }

    public Tarea actualizarTarea(Long id, Tarea tarea) {
        Tarea tareaExistente = tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea con ID " + id + " no encontrada"));

        tareaExistente.setNombre(tarea.getNombre());
        tareaExistente.setDescripcion(tarea.getDescripcion());
        tareaExistente.setFechaInicio(tarea.getFechaInicio());
        tareaExistente.setFechaFin(tarea.getFechaFin());

        return tareaRepository.save(tareaExistente);
    }


    // Crear una nueva tarea
    public Tarea crearTarea(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Obtener todas las tareas de un módulo
    public List<Tarea> obtenerTareasPorModulo(Modulo modulo) {
        return tareaRepository.findByModulo(modulo);
    }

    // Obtener una tarea por ID
    public Optional<Tarea> obtenerTareaPorId(Long id) {
        return tareaRepository.findById(id);
    }

    // Actualizar una tarea
    public Tarea actualizarTarea(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Eliminar una tarea
    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }

    public Tarea actualizarUsuarios(Long moduloId, List<Long> nuevosUsuarioIds) {
        // Buscar el proyecto por ID, lanzando una excepción si no se encuentra
        Tarea modulo = tareaRepository.findById(moduloId)
                .orElseThrow(() -> new ResourceNotFoundException("tarea no encontrado"));

        // Limpiar la lista de usuarios existente (opcional)
        modulo.getUsuarios().clear();

        // Obtener los usuarios a partir de los IDs
        List<Usuario> nuevosUsuarios = usuarioRepository.findAllById(nuevosUsuarioIds);

        // Comprobar si se encontraron usuarios válidos
        if (nuevosUsuarios.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron usuarios con los IDs proporcionados");
        }

        // Agregar los nuevos usuarios al proyecto
        modulo.getUsuarios().addAll(nuevosUsuarios);

        // Guardar el proyecto actualizado
        return tareaRepository.save(modulo);
    }

    public  Tarea eliminarUsuarioDeModulo(Long proyectoId, Long usuarioId) {
        // Buscar el proyecto por su ID, lanzando una excepción si no se encuentra
        Tarea tarea = tareaRepository.findById(proyectoId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto con ID " + proyectoId + " no encontrado"));

        // Filtrar la lista de usuarios para eliminar el usuario con el ID especificado
        boolean usuarioEliminado = tarea.getUsuarios().removeIf(usuario -> usuario.getId().equals(usuarioId));

        // Verificar si el usuario estaba en la lista del proyecto
        if (!usuarioEliminado) {
            throw new ResourceNotFoundException("Usuario con ID " + usuarioId + " no encontrado en el proyecto");
        }

        // Guardar el proyecto actualizado
        return tareaRepository.save(tarea);
    }


    public Tarea actualizarPrioridad(Long moduoId, Long tareaId, Long prioridadId) {
        // Verificar que el proyecto exista
        Modulo modulo = moduloRepository.findById(moduoId)
                .orElseThrow(() -> new ResourceNotFoundException("modulo no encontrado"));

        // Verificar que el módulo pertenezca al proyecto
        Tarea tarea = tareaRepository.findById(tareaId)
                .orElseThrow(() -> new ResourceNotFoundException("taera no encontrado"));

        if (!tarea.getModulo().getId().equals(modulo.getId())) {
            throw new IllegalArgumentException("Latarea no pertenece al modulo especificado");
        }

        // Actualizar la prioridad del módulo
        if (prioridadId == null) {
            tarea.setPrioridad(null);
        } else {
            Prioridad nuevaPrioridad = prioridadRepository.findById(prioridadId)
                    .orElseThrow(() -> new ResourceNotFoundException("Prioridad no encontrada"));
            tarea.setPrioridad(nuevaPrioridad);
        }

        // Guardar y retornar el módulo actualizado
        return tareaRepository.save(tarea);
    }

}
