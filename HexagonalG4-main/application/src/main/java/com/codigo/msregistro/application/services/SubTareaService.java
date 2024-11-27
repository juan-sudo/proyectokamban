package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.SubtareaRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.TareaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubTareaService {

    private final SubtareaRepository subtareaRepository;
    private final TareaRepository tareaRepository;
    private final PrioridadRepository prioridadRepository;
    private final UsuarioRepository usuarioRepository;

    private final AuthService authService;  // Inyección del servicio AuthService


    @Transactional
    public Subtarea moversubTareaAPosicion( Long idTarea,Long idsubTarea, int nuevaPosicion) {
        // Verificar si el proyecto existe y no está eliminado ni archivado
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new EntityNotFoundException("Tarea no encontrado."));
        // Verificar si el módulo existe
        Subtarea subtarea = subtareaRepository.findById(idsubTarea)
                .orElseThrow(() -> new EntityNotFoundException("sub Tarea no encontrado."));

        // Verificar que el módulo pertenece al proyecto
        if (!subtarea.getTarea().getId().equals(tarea.getId())) {
            throw new IllegalArgumentException("El tarea no pertenece al modulo especificado.");
        }

        Long posicionActual = subtarea.getIdSubtareaOrden();

        if (nuevaPosicion > posicionActual) {
            // Decrementar posiciones en el rango entre la posición actual + 1 y la nueva posición
            subtareaRepository.decrementarPosiciones(idTarea, posicionActual, nuevaPosicion);
        }
        else if (nuevaPosicion < posicionActual) {
            // Si la nueva posición es menor que la actual (mover hacia arriba)

            // Incrementar posiciones en el rango entre la nueva posición y la posición actual - 1
            subtareaRepository.incrementarPosiciones(idTarea, nuevaPosicion, posicionActual );
        }

        // Actualizar la posición del módulo
        subtareaRepository.actualizarPosicionTarea(idsubTarea, nuevaPosicion);

        // Retornar el tarea actualizado
        return subtareaRepository.findById(idsubTarea)
                .orElseThrow(() -> new EntityNotFoundException("Error inesperado: módulo no encontrado después de actualizar."));
    }





    //ACTUALIZAR FECHA INCIO SUBTAREA
    public Subtarea actualizarsubTareaFechaFin(Long idTarea, Long idsubTarea, Subtarea subtarea) {

        // Buscar el proyecto
        Optional<Tarea> tareaOptional = tareaRepository.findById(idTarea);

        if (tareaOptional.isPresent()) {
            Tarea modulo1 = tareaOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Subtarea> subtareaOptional = subtareaRepository.findById(idsubTarea);

            if (subtareaOptional.isPresent()) {
                Subtarea subtareaActual = subtareaOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (subtareaActual.getTarea().getId().equals(idTarea)) {

                    // Actualizar los campos del módulo
                    subtareaActual.setFechaFin(subtarea.getFechaFin());
                    subtareaActual.setUserModify(authService.obtenerNombreYApellido());
                    subtareaActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return subtareaRepository.save(subtareaActual);
                } else {
                    throw new IllegalArgumentException("ta tarea no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("tarea no encontrado con ID: " + idsubTarea);
            }
        } else {
            throw new EntityNotFoundException("modulo no encontrado con ID: " + idTarea);
        }
    }


    //ACTUALIZAR FECHA INCIO SUBTAREA
    public Subtarea actualizarsubTareaFechaInicio(Long idTarea, Long idsubTarea, Subtarea subtarea) {

        // Buscar el proyecto
        Optional<Tarea> tareaOptional = tareaRepository.findById(idTarea);

        if (tareaOptional.isPresent()) {
            Tarea modulo1 = tareaOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Subtarea> subtareaOptional = subtareaRepository.findById(idsubTarea);

            if (subtareaOptional.isPresent()) {
                Subtarea subtareaActual = subtareaOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (subtareaActual.getTarea().getId().equals(idTarea)) {

                    // Actualizar los campos del módulo
                    subtareaActual.setFechaInicio(subtarea.getFechaInicio());
                    subtareaActual.setUserModify(authService.obtenerNombreYApellido());
                    subtareaActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return subtareaRepository.save(subtareaActual);
                } else {
                    throw new IllegalArgumentException("ta tarea no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("tarea no encontrado con ID: " + idsubTarea);
            }
        } else {
            throw new EntityNotFoundException("modulo no encontrado con ID: " + idTarea);
        }
    }

    //ACTUALIZAR NOMBRE SUBTAREA
    public Subtarea actualizarsubTareaNombre(Long idTarea, Long idsubTarea, Subtarea subtarea) {

        // Buscar el proyecto
        Optional<Tarea> tareaOptional = tareaRepository.findById(idTarea);

        if (tareaOptional.isPresent()) {
            Tarea modulo1 = tareaOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Subtarea> subtareaOptional = subtareaRepository.findById(idsubTarea);

            if (subtareaOptional.isPresent()) {
                Subtarea subtareaActual = subtareaOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (subtareaActual.getTarea().getId().equals(idTarea)) {

                    // Actualizar los campos del módulo
                    subtareaActual.setNombre(subtarea.getNombre());
                    subtareaActual.setUserModify(authService.obtenerNombreYApellido());
                    subtareaActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return subtareaRepository.save(subtareaActual);
                } else {
                    throw new IllegalArgumentException("ta tarea no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("tarea no encontrado con ID: " + idsubTarea);
            }
        } else {
            throw new EntityNotFoundException("modulo no encontrado con ID: " + idTarea);
        }
    }


    public String deleteSubTarea(Long tareaId,Long idsubTarea) {
        // Verifica si el proyecto existe
        Optional<Tarea> tareaOpt = tareaRepository.findById(tareaId);
        if (!tareaOpt.isPresent()) {
            return "El tarea con ID " + tareaId + " no existe.";
        }
        Long idTareaId=tareaOpt.get().getId();

        // Verifica si el módulo existe
        Optional<Subtarea> subtareaOpt = subtareaRepository.findById(idsubTarea);
        Subtarea subtarea = subtareaOpt.get();
        Long idTareaOrdenActual = subtarea.getIdSubtareaOrden();
        if (tareaOpt.isPresent()) {
            // Elimina el módulo si existe
            // Reorganizar las posiciones de los proyectos restantes para cubrir el hueco
            subtareaRepository.decrementarPosiciones(tareaId,idTareaOrdenActual + 1, Integer.MAX_VALUE);

            subtareaRepository.deleteById(idsubTarea);
            return "Módulo con ID " + idsubTarea + " eliminado correctamente.";
        } else {
            return "El módulo con ID " + idsubTarea + " no existe.";
        }
    }


    // Crear una nueva tarea
    public Subtarea crearTarea(Tarea tarea,Subtarea subtarea) {
        subtarea.setUserCreate(authService.obtenerNombreYApellido());
        subtarea.setCreateAt(new Date());

        // Obtener todos los módulos ordenados por idModuloOrden para el proyecto
        List<Subtarea> subatareas = subtareaRepository.findByModuloIdOrderByIdTareaOrdenDesc(tarea.getId());

        // Calcular el siguiente idModuloOrden
        long siguienteId = 1L; // Valor por defecto en caso de que no haya módulos

        if (!subatareas.isEmpty()) {

            Subtarea ultimosubTarea = subatareas.get(0);  // Ya que están ordenados en orden descendente
            siguienteId = ultimosubTarea.getIdSubtareaOrden() + 1;  // El siguiente valor será el inmediato después del mayor

        }

        // Asignar el siguiente idModuloOrden al nuevo módulo
        subtarea.setIdSubtareaOrden(siguienteId);

        return subtareaRepository.save(subtarea);


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
        subtaera.setUserModify(authService.obtenerNombreYApellido());
        subtaera.setModifyAt(new Date());


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
