package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.codigo.msregistro.infraestructure.repositories.ProyectoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Calendar;


@Service
@AllArgsConstructor
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;

    private final UsuarioRepository usuarioRepository;

    private final PrioridadRepository prioridadRepository;

    @Transactional
    public Proyecto moverProyectoAPosicion(Long idProyecto, int nuevaPosicion) {
        // Incrementar la posición de todos los proyectos con id_proyecto_orden >= nuevaPosicion
        proyectoRepository.incrementarPosiciones(nuevaPosicion);

        // Actualizar la posición del proyecto con el id especificado
        proyectoRepository.actualizarPosicionProyecto(idProyecto, nuevaPosicion);

        // Retornar el proyecto actualizado
        return proyectoRepository.findById(idProyecto).orElse(null);
    }

//CAMBIO DE POSICION
// Método para actualizar la posición de un proyecto en la lista
//public Proyecto actualizarPosicion(Long idPocisionJalar, Long idPosicionPoner) {
//
//    // Obtener el proyecto que deseas mover (según idProyectoOrden)
//    Proyecto proyectoMover = proyectoRepository.findByIdProyectoOrden(idPocisionJalar);
//
//
//    if (proyectoMover != null) {
//        Long currentOrder = proyectoMover.getIdProyectoOrden();
//
//        // Si la nueva posición es la misma que la actual, no hay nada que hacer
//        if (currentOrder.equals(idPosicionPoner)) {
//            return proyectoMover;
//        }
//
//        // Obtener todos los proyectos y ordenarlos por idProyectoOrden
//        List<Proyecto> proyectos = proyectoRepository.findAll();
//        proyectos.sort(Comparator.comparingLong(Proyecto::getIdProyectoOrden));
//
//        // Remover el proyecto a mover de la lista
//        proyectos.remove(proyectoMover);
//
//        // Insertar el proyecto en la nueva posición
//        int nuevaPosicion = Math.toIntExact(idPosicionPoner - 1); // Convertir Long a int y ajustar posición (índice de la lista)
//        proyectos.add(nuevaPosicion, proyectoMover);
//
//        // Asignar nuevos valores de idProyectoOrden según la posición en la lista
//        for (int i = 0; i < proyectos.size(); i++) {
//            proyectos.get(i).setIdProyectoOrden((long) (i + 1)); // Asignar orden a partir de 1
//            proyectoRepository.save(proyectos.get(i)); // Guardar cada proyecto con su nuevo orden
//        }
//
//        // Devolver el proyecto movido con su nueva posición
//        return proyectoMover;
//    }
//
//    return null; // Si no se encuentra el proyecto, retornar null
//}


    //ACTUALIZR NOMBRE PROYECTO
    public Proyecto actualizarFechaInicioProyecto(Long id, Proyecto proyecto) {
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(id);

        if (proyectoOptional.isPresent()) {
            Proyecto proyectoActual = proyectoOptional.get();

            // Actualizar los campos del proyecto
            proyectoActual.setFechaInicio(proyecto.getFechaInicio());
            proyectoActual.setUserModify("quiii santa perez");
            proyectoActual.setModifyAt(new Date());



            // Guardar el proyecto actualizado
            return proyectoRepository.save(proyectoActual);  // Retorna el proyecto actualizado
        } else {
            // Opcionalmente, lanzar una excepción si no se encuentra el proyecto
            throw new EntityNotFoundException("Proyecto no encontrado con ID: " + id);
        }
    }

    //AMPLIAR FECHA
    public Proyecto ampliarFechaProyecto(Long idProyecto, Long dias) {
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(idProyecto);

        if (proyectoOptional.isPresent()) {
            Proyecto proyectoActual = proyectoOptional.get();

            // Obtener fechaFin y agregar los días
            Date fechaFin = proyectoActual.getFechaFin();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(fechaFin);
            calendar.add(Calendar.DAY_OF_MONTH, dias.intValue());  // Sumar los días a fechaFin

            // Establecer fecha ampliada en el proyecto
            proyectoActual.setFechaAmpliada(calendar.getTime());

            proyectoActual.setUserModify("quiii santa perez");
            proyectoActual.setModifyAt(new Date());

            // Guardar el proyecto actualizado
            return proyectoRepository.save(proyectoActual);  // Retorna el proyecto actualizado
        } else {
            // Opcionalmente, lanzar una excepción si no se encuentra el proyecto
            throw new EntityNotFoundException("Proyecto no encontrado con ID: " + idProyecto);
        }
    }

    //ACTUALIZR NOMBRE PROYECTO
    public Proyecto actualizarNombreProyecto(Long id, Proyecto proyecto) {
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(id);

        if (proyectoOptional.isPresent()) {
            Proyecto proyectoActual = proyectoOptional.get();

            // Actualizar los campos del proyecto
            proyectoActual.setNombre(proyecto.getNombre());
            proyectoActual.setUserModify("quiii santa perez");
            proyectoActual.setModifyAt(new Date());



            // Guardar el proyecto actualizado
            return proyectoRepository.save(proyectoActual);  // Retorna el proyecto actualizado
        } else {
            // Opcionalmente, lanzar una excepción si no se encuentra el proyecto
            throw new EntityNotFoundException("Proyecto no encontrado con ID: " + id);
        }
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
        proyecto.setBackgroundProyecto(generarColorAleatorio());
        proyecto.setUserCreate("salomon santa perez");
        proyecto.setCreateAt(new Date());

        // Obtener el valor actual más alto de idProyectoOrden
        Long maxIdProyectoOrden = proyectoRepository.findMaxIdProyectoOrden();

        // Incrementar idProyectoOrden o reiniciar si se alcanza el máximo de Long
        if (maxIdProyectoOrden == null || maxIdProyectoOrden.equals(Long.MAX_VALUE)) {
            proyecto.setIdProyectoOrden(1L);
        } else {
            proyecto.setIdProyectoOrden(maxIdProyectoOrden + 1);
        }

        return proyectoRepository.save(proyecto);
    }

    private String generarColorAleatorio() {
        int color = (int) (Math.random() * 0xFFFFFF);
        return String.format("#%06X", color);
    }

    // EMILNAR PROYECTO mover a papelera
    public boolean eliminarProyecto(Long id) {
        Optional<Proyecto> proyecto = proyectoRepository.findById(id);

        if (proyecto.isPresent()) {
            Proyecto p = proyecto.get();
            p.setUserDelete("pepe diaz salvatierra");
            p.setDeleteAt(new Date());
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
        // Obtener los proyectos no archivados sin eliminar y ordenarlos por idProyectoOrden en orden ascendente
        List<Proyecto> proyectos = proyectoRepository.findByEstadoNotAndEliminadoFalse(
                EstadoProyecto.ARCHIVADO,
                Sort.by(Sort.Direction.ASC, "idProyectoOrden")
        );


        // Ordenar los módulos, tareas y subtareas dentro de cada proyecto en orden descendente
        proyectos.forEach(proyecto -> {
            // Ordenar módulos en orden descendente por "id"
            proyecto.getModulos().sort(Comparator.comparing(Modulo::getId).reversed());

            proyecto.getModulos().forEach(modulo -> {
                // Ordenar tareas dentro de cada módulo en orden descendente por "id"
                modulo.getTareas().sort(Comparator.comparing(Tarea::getId).reversed());

                // Ordenar subtareas dentro de cada tarea en orden descendente por "id"
                modulo.getTareas().forEach(tarea ->
                        tarea.getSubtareas().sort(Comparator.comparing(Subtarea::getId).reversed())
                );
            });
        });

        return proyectos;
    }


    public List<Proyecto> listarProyectosArchivados() {
        return proyectoRepository.findByEstado(EstadoProyecto.ARCHIVADO);
    }

    public List<Proyecto> listarProyectosElimindos() {
        return proyectoRepository.findByEliminadoTrue();
    }



    // CAMIBAR ESTADO DE PROYECTOS
    public boolean cambiarEstadoProyecto(Long id, EstadoProyecto nuevoEstado) {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(id);

        if (proyectoOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();
            proyecto.setEstado(nuevoEstado);  // Actualizar el estado del proyecto
            if(nuevoEstado.equals(EstadoProyecto.ARCHIVADO)){
                proyecto.setArchivarAt(new Date());
                proyecto.setArchivarDelete("SAlomon lopez de la tierra");
            }
            proyectoRepository.save(proyecto);  // Guardar los cambios
            return true;
        }

        return false;  // Si el proyecto no existe, devolver false
    }

    // Método para cambiar el estado de un proyecto
    public boolean restaurarProyectoNoArchivado(Long id) {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(id);

        if (proyectoOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();
            proyecto.setEstado(EstadoProyecto.PENDIENTE);  // Actualizar el estado del proyecto
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
        proyecto.setModifyAt(new Date());
        proyecto.setUserModify("pamela perez dias");

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

