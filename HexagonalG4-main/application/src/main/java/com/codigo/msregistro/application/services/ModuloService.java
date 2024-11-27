package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.ModuloRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.ProyectoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;


import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class ModuloService {

    private final ModuloRepository moduloRepository;
    private final UsuarioRepository usuarioRepository;
    private final PrioridadRepository prioridadRepository;
    private final ProyectoRepository proyectoRepository;
    private final AuthService authService;  // Inyección del servicio AuthService

    @Transactional
    public Modulo moverProyectoAPosicion(Long idProyecto, Long idModulo, int nuevaPosicion) {
        // Verificar si el proyecto existe y no está eliminado ni archivado
        Proyecto proyecto = proyectoRepository.findByIdAndEliminadoAndEstadoNot(
                idProyecto, false, EstadoProyecto.ARCHIVADO
        ).orElseThrow(() -> new EntityNotFoundException("Proyecto no encontrado o no cumple las condiciones."));

        // Verificar si el módulo existe
        Modulo modulo = moduloRepository.findById(idModulo)
                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado."));

        // Verificar que el módulo pertenece al proyecto
        if (!modulo.getProyecto().getId().equals(proyecto.getId())) {
            throw new IllegalArgumentException("El módulo no pertenece al proyecto especificado.");
        }

        // Obtener la posición actual del módulo
        Long posicionActual = modulo.getIdModuloOrden();

        // Si la nueva posición es igual a la actual, no hacer nada
       // if (posicionActual == nuevaPosicion) {
         //   return modulo;
        //}

        // Si la nueva posición es mayor que la actual (mover hacia abajo)
        if (nuevaPosicion > posicionActual) {
            // Decrementar posiciones en el rango entre la posición actual + 1 y la nueva posición
            moduloRepository.decrementarPosiciones(idProyecto, posicionActual , nuevaPosicion);
        }
         else if (nuevaPosicion < posicionActual) {
        // Si la nueva posición es menor que la actual (mover hacia arriba)

            // Incrementar posiciones en el rango entre la nueva posición y la posición actual - 1
            moduloRepository.incrementarPosiciones(idProyecto, nuevaPosicion, posicionActual );
        }

        // Actualizar la posición del módulo
        moduloRepository.actualizarPosicionModulo(idModulo, nuevaPosicion);

        // Retornar el módulo actualizado
        return moduloRepository.findById(idModulo)
                .orElseThrow(() -> new EntityNotFoundException("Error inesperado: módulo no encontrado después de actualizar."));
    }


//    @Transactional
//    public Modulo moverProyectoAPosicion(Long idProyecto, Long idModulo, int nuevaPosicion) {
//        // Verificar si el proyecto existe y no está eliminado ni archivado
//        Proyecto proyecto = proyectoRepository.findByIdAndEliminadoAndEstadoNot(
//                idProyecto, false, EstadoProyecto.ARCHIVADO
//        ).orElseThrow(() -> new EntityNotFoundException("Proyecto no encontrado o no cumple las condiciones."));
//
//        // Verificar si el módulo existe
//        Modulo modulo = moduloRepository.findById(idModulo)
//                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado."));
//
//        // Verificar que el módulo pertenece al proyecto
//        if (!modulo.getProyecto().getId().equals(proyecto.getId())) {
//            throw new IllegalArgumentException("El módulo no pertenece al proyecto especificado.");
//        }
//
//        // Obtener la posición actual del módulo
//        Long posicionActual = modulo.getIdModuloOrden();
//
//        // Si la nueva posición es igual a la actual, no hacer nada
//        if (posicionActual == nuevaPosicion) {
//            return modulo;
//        }
//
//        // Actualizar las posiciones de los demás módulos en el rango afectado
//        if (nuevaPosicion > posicionActual) {
//            // Mover hacia abajo: disminuir las posiciones de los módulos entre la posición actual + 1 y la nueva posición
//            moduloRepository.decrementarPosiciones(idProyecto, posicionActual + 1, nuevaPosicion);
//        } else {
//            // Mover hacia arriba: aumentar las posiciones de los módulos entre la nueva posición y la posición actual - 1
//            moduloRepository.incrementarPosiciones(idProyecto, nuevaPosicion, posicionActual - 1);
//        }
//
//
//
//        // Actualizar la posición del módulo
//        moduloRepository.actualizarPosicionModulo(idModulo, nuevaPosicion);
//
//        // Retornar el módulo actualizado
//        return moduloRepository.findById(idModulo)
//                .orElseThrow(() -> new EntityNotFoundException("Error inesperado: módulo no encontrado después de actualizar."));
//    }
//


    // Actualizar una tarea
    public Modulo actualizarTarea(Modulo tarea) {
        return moduloRepository.save(tarea);
    }

    // ACTUALIZAR FECHA FIN MODULO
    public Modulo actualizarFechaInicioModuloFin(Long idProyecto, Long idModulo, Modulo modulo) {

        // Buscar el proyecto
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(idProyecto);

        if (proyectoOptional.isPresent()) {
            Proyecto proyecto = proyectoOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Modulo> moduloOptional = moduloRepository.findById(idModulo);

            if (moduloOptional.isPresent()) {
                Modulo modeloActual = moduloOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (modeloActual.getProyecto().getId().equals(idProyecto)) {

                    // Actualizar los campos del módulo
                    modeloActual.setFechaFin(modulo.getFechaFin());
                    modeloActual.setUserModify(authService.obtenerNombreYApellido());
                    modeloActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return moduloRepository.save(modeloActual);
                } else {
                    throw new IllegalArgumentException("El módulo no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("Módulo no encontrado con ID: " + idModulo);
            }
        } else {
            throw new EntityNotFoundException("Proyecto no encontrado con ID: " + idProyecto);
        }
    }

    // ACTUALIZAR FECHA INICIO MODULO
    public Modulo actualizarFechaInicioModulo(Long idProyecto, Long idModulo, Modulo modulo) {

        // Buscar el proyecto
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(idProyecto);

        if (proyectoOptional.isPresent()) {
            Proyecto proyecto = proyectoOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Modulo> moduloOptional = moduloRepository.findById(idModulo);

            if (moduloOptional.isPresent()) {
                Modulo modeloActual = moduloOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (modeloActual.getProyecto().getId().equals(idProyecto)) {

                    // Actualizar los campos del módulo
                    modeloActual.setFechaInicio(modulo.getFechaInicio());
                    modeloActual.setUserModify(authService.obtenerNombreYApellido());
                    modeloActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return moduloRepository.save(modeloActual);
                } else {
                    throw new IllegalArgumentException("El módulo no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("Módulo no encontrado con ID: " + idModulo);
            }
        } else {
            throw new EntityNotFoundException("Proyecto no encontrado con ID: " + idProyecto);
        }
    }
    // ELIMINAR MODULO
    public String deleteModulo(Long idProyecto, Long idModulo) {
        // Verifica si el proyecto existe
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(idProyecto);
        if (!proyectoOpt.isPresent()) {
            return "El proyecto con ID " + idProyecto + " no existe.";
        }

        Long idProyectoId=proyectoOpt.get().getId();

        // Verifica si el módulo existe
        Optional<Modulo> moduloOpt = moduloRepository.findById(idModulo);
        Modulo modulo = moduloOpt.get();
        Long idModuloOrdenActual = modulo.getIdModuloOrden();

        if (moduloOpt.isPresent()) {
            // Elimina el módulo si existe
            // Reorganizar las posiciones de los proyectos restantes para cubrir el hueco
            moduloRepository.decrementarPosiciones(idProyectoId,idModuloOrdenActual + 1, Integer.MAX_VALUE);

            moduloRepository.deleteById(idModulo);
            return "Módulo con ID " + idModulo + " eliminado correctamente.";
        } else {
            return "El módulo con ID " + idModulo + " no existe.";
        }
    }



    // ACTUALIZAR NOMBRE MODULO
    public Modulo actualizarModulo(Long idProyecto, Long idModulo, Modulo modulo) {

        // Buscar el proyecto
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(idProyecto);

        if (proyectoOptional.isPresent()) {
            Proyecto proyecto = proyectoOptional.get();

            // Buscar el módulo y verificar que esté asociado al proyecto
            Optional<Modulo> moduloOptional = moduloRepository.findById(idModulo);

            if (moduloOptional.isPresent()) {
                Modulo modeloActual = moduloOptional.get();

                // Verificar que el módulo pertenece al proyecto
                if (modeloActual.getProyecto().getId().equals(idProyecto)) {

                    // Actualizar los campos del módulo
                    modeloActual.setNombre(modulo.getNombre());
                    modeloActual.setUserModify(authService.obtenerNombreYApellido());
                    modeloActual.setModifyAt(new Date());

                    // Guardar el módulo actualizado
                    return moduloRepository.save(modeloActual);
                } else {
                    throw new IllegalArgumentException("El módulo no pertenece al proyecto especificado");
                }
            } else {
                throw new EntityNotFoundException("Módulo no encontrado con ID: " + idModulo);
            }
        } else {
            throw new EntityNotFoundException("Proyecto no encontrado con ID: " + idProyecto);
        }
    }

    public Modulo crearModulo(Proyecto proyecto, Modulo modulo) {
        modulo.setProyecto(proyecto);
        modulo.setEstado(EstadoModulo.PENDIENTE);
        modulo.setUserCreate(authService.obtenerNombreYApellido());
        modulo.setCreateAt(new Date());


        // Obtener todos los módulos ordenados por idModuloOrden para el proyecto
        List<Modulo> modulos = moduloRepository.findByProyectoIdOrderByIdModuloOrdenDesc(proyecto.getId());

        // Calcular el siguiente idModuloOrden
        long siguienteId = 1L; // Valor por defecto en caso de que no haya módulos

        if (!modulos.isEmpty()) {

            Modulo ultimoModulo = modulos.get(0);  // Ya que están ordenados en orden descendente
            siguienteId = ultimoModulo.getIdModuloOrden() + 1;  // El siguiente valor será el inmediato después del mayor

        }

        // Asignar el siguiente idModuloOrden al nuevo módulo
        modulo.setIdModuloOrden(siguienteId);

        return moduloRepository.save(modulo);
    }



    public Optional<Modulo> obtenerModuloPorId(Long id) {
        return moduloRepository.findById(id);
    }


    public Modulo actualizarUsuarios(Long moduloId, List<Long> nuevosUsuarioIds) {
        // Buscar el proyecto por ID, lanzando una excepción si no se encuentra
        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));

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
        return moduloRepository.save(modulo);
    }

    public  Modulo eliminarUsuarioDeModulo(Long proyectoId, Long usuarioId) {
        // Buscar el proyecto por su ID, lanzando una excepción si no se encuentra
        Modulo modulo = moduloRepository.findById(proyectoId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto con ID " + proyectoId + " no encontrado"));

        // Filtrar la lista de usuarios para eliminar el usuario con el ID especificado
        boolean usuarioEliminado = modulo.getUsuarios().removeIf(usuario -> usuario.getId().equals(usuarioId));

        // Verificar si el usuario estaba en la lista del proyecto
        if (!usuarioEliminado) {
            throw new ResourceNotFoundException("Usuario con ID " + usuarioId + " no encontrado en el proyecto");
        }

        // Guardar el proyecto actualizado
        return moduloRepository.save(modulo);
    }

    public Modulo actualizarPrioridad(Long proyectoId, Long moduloId, Long prioridadId) {
        // Verificar que el proyecto exista
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));

        // Verificar que el módulo pertenezca al proyecto
        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado"));

        if (!modulo.getProyecto().getId().equals(proyecto.getId())) {
            throw new IllegalArgumentException("El módulo no pertenece al proyecto especificado");
        }

        // Actualizar la prioridad del módulo
        if (prioridadId == null) {
            modulo.setPrioridad(null);
        } else {
            Prioridad nuevaPrioridad = prioridadRepository.findById(prioridadId)
                    .orElseThrow(() -> new ResourceNotFoundException("Prioridad no encontrada"));
            modulo.setPrioridad(nuevaPrioridad);
        }

        // Guardar y retornar el módulo actualizado
        return moduloRepository.save(modulo);
    }
    // Otros métodos como actualizar, eliminar, etc.
}
