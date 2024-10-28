package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Subtarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.SubtareaRepository;
import com.codigo.msregistro.infraestructure.repositories.TareaRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubTareaService {

    private final SubtareaRepository tareaRepository;

    private final UsuarioRepository usuarioRepository;

    // Crear una nueva tarea
    public Subtarea crearTarea(Subtarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Obtener todas las tareas de un módulo
    public List<Subtarea> obtenerTareasPorModulo(Tarea tarea) {
        return tareaRepository.findByTarea(tarea);
    }

    // Obtener una tarea por ID
    public Optional<Subtarea> obtenerTareaPorId(Long id) {
        return tareaRepository.findById(id);
    }

    // Actualizar una tarea
    public Subtarea actualizarTarea(Subtarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Eliminar una tarea
    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }

    public Subtarea actualizarUsuarios(Long subtareaId, List<Long> nuevosUsuarioIds) {
        // Buscar el subtarea por ID, lanzando una excepción si no se encuentra
        Subtarea subtaera = tareaRepository.findById(subtareaId)
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
        return tareaRepository.save(subtaera);
    }

    public  Subtarea eliminarUsuarioDeModulo(Long subtaraId, Long usuarioId) {
        // Buscar el proyecto por su ID, lanzando una excepción si no se encuentra
        Subtarea subtarea = tareaRepository.findById(subtaraId)
                .orElseThrow(() -> new ResourceNotFoundException("subtarea con ID " + subtaraId + " no encontrado"));

        // Filtrar la lista de usuarios para eliminar el usuario con el ID especificado
        boolean usuarioEliminado = subtarea.getUsuarios().removeIf(usuario -> usuario.getId().equals(usuarioId));

        // Verificar si el usuario estaba en la lista del proyecto
        if (!usuarioEliminado) {
            throw new ResourceNotFoundException("Usuario con ID " + usuarioId + " no encontrado en el proyecto");
        }

        // Guardar el proyecto actualizado
        return tareaRepository.save(subtarea);
    }
}
