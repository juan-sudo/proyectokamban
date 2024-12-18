package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.ModuloRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.PrioridadRepository;
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
    public class TareaService {

        private final TareaRepository tareaRepository;
        private final UsuarioRepository usuarioRepository;
        private final PrioridadRepository prioridadRepository;
        private final ModuloRepository moduloRepository;
    private final AuthService authService;  // Inyección del servicio AuthService



    @Transactional
    public Tarea moverTareaAPosicion( Long idModulo,Long idTarea, int nuevaPosicion) {
        // Verificar si el proyecto existe y no está eliminado ni archivado
        Modulo modulo = moduloRepository.findById(idModulo)
                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado."));
        // Verificar si el módulo existe
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new EntityNotFoundException("Tarea no encontrado."));

        // Verificar que el módulo pertenece al proyecto
        if (!tarea.getModulo().getId().equals(modulo.getId())) {
            throw new IllegalArgumentException("El tarea no pertenece al modulo especificado.");
        }

        Long posicionActual = tarea.getIdTareaOrden();

        if (nuevaPosicion > posicionActual) {
            // Decrementar posiciones en el rango entre la posición actual + 1 y la nueva posición
            tareaRepository.decrementarPosiciones(idModulo, posicionActual, nuevaPosicion);
        }
        else if (nuevaPosicion < posicionActual) {
            // Si la nueva posición es menor que la actual (mover hacia arriba)

            // Incrementar posiciones en el rango entre la nueva posición y la posición actual - 1
            tareaRepository.incrementarPosiciones(idModulo, nuevaPosicion, posicionActual );
        }

        // Actualizar la posición del módulo
        tareaRepository.actualizarPosicionTarea(idTarea, nuevaPosicion);

        // Retornar el tarea actualizado
        return tareaRepository.findById(idTarea)
                .orElseThrow(() -> new EntityNotFoundException("Error inesperado: módulo no encontrado después de actualizar."));
    }



    //ACTULIZAR FECHA FIN
    public Tarea actualizarTareaFechaFin(Long idModulo, Long idTarea, Tarea tarea) {

        // Buscar el proyecto
        Optional<Modulo> moduloOptional = moduloRepository.findById(idModulo);

        if (moduloOptional.isPresent()) {
            Modulo modulo1 = moduloOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Tarea> tareaOptional = tareaRepository.findById(idTarea);

            if (tareaOptional.isPresent()) {
                Tarea tareaActual = tareaOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (tareaActual.getModulo().getId().equals(idModulo)) {

                    // Actualizar los campos del módulo
                    tareaActual.setFechaFin(tarea.getFechaFin());
                    tareaActual.setUserModify(authService.obtenerNombreYApellido());
                    tareaActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return tareaRepository.save(tareaActual);
                } else {
                    throw new IllegalArgumentException("ta tarea no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("tarea no encontrado con ID: " + idTarea);
            }
        } else {
            throw new EntityNotFoundException("modulo no encontrado con ID: " + idModulo);
        }
    }
        //ACTULIZAR FECHA INICIO
    public Tarea actualizarTareaFechaInicio(Long idModulo, Long idTarea, Tarea tarea) {

        // Buscar el proyecto
        Optional<Modulo> moduloOptional = moduloRepository.findById(idModulo);

        if (moduloOptional.isPresent()) {
            Modulo modulo1 = moduloOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Tarea> tareaOptional = tareaRepository.findById(idTarea);

            if (tareaOptional.isPresent()) {
                Tarea tareaActual = tareaOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (tareaActual.getModulo().getId().equals(idModulo)) {

                    // Actualizar los campos del módulo
                    tareaActual.setFechaInicio(tarea.getFechaInicio());
                    tareaActual.setUserModify(authService.obtenerNombreYApellido());
                    tareaActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return tareaRepository.save(tareaActual);
                } else {
                    throw new IllegalArgumentException("ta tarea no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("tarea no encontrado con ID: " + idTarea);
            }
        } else {
            throw new EntityNotFoundException("modulo no encontrado con ID: " + idModulo);
        }
    }

        //ACTUALIZAR NOMBRE TAREA

        public Tarea actualizarTareaNombre(Long idModulo, Long idTarea, Tarea tarea) {

            // Buscar el proyecto
            Optional<Modulo> moduloOptional = moduloRepository.findById(idModulo);

            if (moduloOptional.isPresent()) {
                Modulo modulo1 = moduloOptional.get();

                // Buscar el módulo y verificar que esté asociado al proyecto
                Optional<Tarea> tareaOptional = tareaRepository.findById(idTarea);

                if (tareaOptional.isPresent()) {
                    Tarea tareaActual = tareaOptional.get();

                    // Verificar que el módulo pertenece al proyecto
                    if (tareaActual.getModulo().getId().equals(idModulo)) {

                        // Actualizar los campos del módulo
                        tareaActual.setNombre(tarea.getNombre());
                        tareaActual.setUserModify(authService.obtenerNombreYApellido());
                        tareaActual.setModifyAt(new Date());

                        // Guardar el módulo actualizado
                        return tareaRepository.save(tareaActual);
                    } else {
                        throw new IllegalArgumentException("ta tarea no pertenece al proyecto especificado");
                    }
                } else {
                    throw new EntityNotFoundException("tarea no encontrado con ID: " + idTarea);
                }
            } else {
                throw new EntityNotFoundException("modulo no encontrado con ID: " + idModulo);
            }
        }

    public String deleteTarea(Long moduloId,Long idTarea) {
        // Verifica si el proyecto existe
        Optional<Modulo> moduloOpt = moduloRepository.findById(moduloId);
        if (!moduloOpt.isPresent()) {
            return "El tarea con ID " + moduloId + " no existe.";
        }

        Long idModuloId=moduloOpt.get().getId();

        // Verifica si el módulo existe
        Optional<Tarea> tareaOpt = tareaRepository.findById(idTarea);
        Tarea tarea = tareaOpt.get();
        Long idTareaOrdenActual = tarea.getIdTareaOrden();

        if (moduloOpt.isPresent()) {
            // Elimina el módulo si existe
            // Reorganizar las posiciones de los proyectos restantes para cubrir el hueco
            tareaRepository.decrementarPosiciones(idModuloId,idTareaOrdenActual + 1, Integer.MAX_VALUE);

            tareaRepository.deleteById(idTarea);
            return "Módulo con ID " + idTarea + " eliminado correctamente.";
        } else {
            return "El módulo con ID " + idTarea + " no existe.";
        }
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
        public Tarea crearTarea(Modulo modulo,Tarea tarea) {
            tarea.setUserCreate(authService.obtenerNombreYApellido());
            tarea.setCreateAt(new Date());
            // Obtener todos los módulos ordenados por idModuloOrden para el proyecto
            List<Tarea> tareas = tareaRepository.findByModuloIdOrderByIdTareaOrdenDesc(modulo.getId());

            // Calcular el siguiente idModuloOrden
            long siguienteId = 1L; // Valor por defecto en caso de que no haya módulos

            if (!tareas.isEmpty()) {

                Tarea ultimoTarea = tareas.get(0);  // Ya que están ordenados en orden descendente
                siguienteId = ultimoTarea.getIdTareaOrden() + 1;  // El siguiente valor será el inmediato después del mayor

            }

            // Asignar el siguiente idModuloOrden al nuevo módulo
            tarea.setIdTareaOrden(siguienteId);

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
        modulo.setUserModify(authService.obtenerNombreYApellido());
        modulo.setModifyAt(new Date());


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
