package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.SubtareaRepository;
import com.codigo.msregistro.infraestructure.repositories.TareaRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubTareaService {

    private final SubtareaRepository subtareaRepository;
    private final TareaRepository tareaRepository;
    private final PrioridadRepository prioridadRepository;
    private final UsuarioRepository usuarioRepository;

    // Crear una nueva tarea
    public Subtarea crearTarea(Subtarea tarea) {
        return subtareaRepository.save(tarea);
    }

    public Subtarea actualizarSubtarea(Long id, Subtarea tarea) {
        // Busca la subtarea por ID
        Optional<Subtarea> optionalSubtarea = subtareaRepository.findById(id);

        // Verifica si la subtarea existe
        if (optionalSubtarea.isPresent()) {
            Subtarea subtarea = optionalSubtarea.get();

            // Actualiza los campos de la subtarea
            subtarea.setNombre(tarea.getNombre());
            subtarea.setDescripcion(tarea.getDescripcion());
            subtarea.setFechaInicio(tarea.getFechaInicio());
            subtarea.setFechaFin(tarea.getFechaFin());

            // Guarda la subtarea actualizada
            return subtareaRepository.save(subtarea);
        } else {
            // Manejar el caso en que la subtarea no existe (puedes lanzar una excepción o retornar null)
            throw new EntityNotFoundException("Subtarea no encontrada con ID: " + id);
        }
    }


    // Obtener todas las tareas de un módulo
    public List<Subtarea> obtenerTareasPorModulo(Tarea tarea) {
        return subtareaRepository.findByTarea(tarea);
    }

    // Obtener una tarea por ID
    public Optional<Subtarea> obtenerTareaPorId(Long id) {
        return subtareaRepository.findById(id);
    }

    // Actualizar una tarea
    public Subtarea actualizarTarea(Subtarea tarea) {
        return subtareaRepository.save(tarea);
    }

    // Eliminar una tarea
    public void eliminarTarea(Long id) {
        subtareaRepository.deleteById(id);
    }

    public Subtarea actualizarUsuarios(Long subtareaId, List<Long> nuevosUsuarioIds) {
        // Buscar el subtarea por ID, lanzando una excepción si no se encuentra
        Subtarea subtaera = subtareaRepository.findById(subtareaId)
                .orElseThrow(() -> new ResourceNotFoundException("subtarea no encontrado"));

        // Limpiar la lista de usuarios existente (opcional)
        subtaera.getUsuarios().clear();

        // Obtener los usuarios a partir de los IDs
        List<Usuario> nuevosUsuarios = usuarioRepository.findAllById(nuevosUsuarioIds);

        // Comprobar si se encontraron usuarios válidos
        if (nuevosUsuarios.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron usuarios con los IDs proporcionados");
        }

        // Agregar los nuevos usuarios a subtarea
        subtaera.getUsuarios().addAll(nuevosUsuarios);

        // Guardar el proyecto actualizado
        return subtareaRepository.save(subtaera);
    }

    public  Subtarea eliminarUsuarioDeModulo(Long subtaraId, Long usuarioId) {
        // Buscar el proyecto por su ID, lanzando una excepción si no se encuentra
        Subtarea subtarea = subtareaRepository.findById(subtaraId)
                .orElseThrow(() -> new ResourceNotFoundException("subtarea con ID " + subtaraId + " no encontrado"));

        // Filtrar la lista de usuarios para eliminar el usuario con el ID especificado
        boolean usuarioEliminado = subtarea.getUsuarios().removeIf(usuario -> usuario.getId().equals(usuarioId));

        // Verificar si el usuario estaba en la lista del proyecto
        if (!usuarioEliminado) {
            throw new ResourceNotFoundException("Usuario con ID " + usuarioId + " no encontrado en el proyecto");
        }

        // Guardar el proyecto actualizado
        return subtareaRepository.save(subtarea);
    }


    public Subtarea actualizarPrioridad(Long tareaId, Long subtareaId, Long prioridadId) {
        // Verificar que el proyecto exista
        Tarea tarea = tareaRepository.findById(tareaId)
                .orElseThrow(() -> new ResourceNotFoundException("modulo no encontrado"));

        // Verificar que el módulo pertenezca al proyecto
        Subtarea subtarea = subtareaRepository.findById(subtareaId)
                .orElseThrow(() -> new ResourceNotFoundException("taera no encontrado"));

        if (!subtarea.getTarea().getId().equals(tarea.getId())) {
            throw new IllegalArgumentException("Latarea no pertenece al modulo especificado");
        }

        // Actualizar la prioridad del módulo
        if (prioridadId == null) {
            subtarea.setPrioridad(null);
        } else {
            Prioridad nuevaPrioridad = prioridadRepository.findById(prioridadId)
                    .orElseThrow(() -> new ResourceNotFoundException("Prioridad no encontrada"));
            subtarea.setPrioridad(nuevaPrioridad);
        }

        // Guardar y retornar el módulo actualizado
        return subtareaRepository.save(subtarea);
    }
}
