package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.Tarea;
import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.TareaRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TareaService {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;
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

}
