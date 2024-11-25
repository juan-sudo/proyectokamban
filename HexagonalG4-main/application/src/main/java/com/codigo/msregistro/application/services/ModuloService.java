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


import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class ModuloService {

    private final ModuloRepository moduloRepository;
    private final UsuarioRepository usuarioRepository;
    private final PrioridadRepository prioridadRepository;
    private final ProyectoRepository proyectoRepository;
    private final AuthService authService;  // Inyección del servicio AuthService

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

        // Verifica si el módulo existe
        Optional<Modulo> moduloOpt = moduloRepository.findById(idModulo);
        if (moduloOpt.isPresent()) {
            // Elimina el módulo si existe
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
