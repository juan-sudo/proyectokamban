package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import com.codigo.msregistro.infraestructure.repositories.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Calendar;


@Service
//@AllArgsConstructor
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PrioridadRepository prioridadRepository;
    private final ModuloRepository moduloRepository;
    private final TareaRepository tareaRepository;
    private final SubtareaRepository subtareaRepository;
    private final AuthService authService;  // Inyección del servicio AuthService


    @Autowired
    public ProyectoService(ProyectoRepository proyectoRepository, UsuarioRepository usuarioRepository,
                           PrioridadRepository prioridadRepository, ModuloRepository moduloRepository,
                           TareaRepository tareaRepository, SubtareaRepository subtareaRepository,
                           AuthService authService) {
        this.proyectoRepository = proyectoRepository;
        this.usuarioRepository = usuarioRepository;
        this.prioridadRepository = prioridadRepository;
        this.moduloRepository = moduloRepository;
        this.tareaRepository = tareaRepository;
        this.subtareaRepository = subtareaRepository;
        this.authService = authService;
    }


    public List<Proyecto> listarProyectosNoArchivados() {
        // Obtener los proyectos no archivados sin eliminar y ordenarlos por idProyectoOrden en orden descendente
        List<Proyecto> proyectos = proyectoRepository.findByEstadoNotAndEliminadoFalse(
                EstadoProyecto.ARCHIVADO,
                Sort.by(Sort.Direction.DESC, "idProyectoOrden")
        );

        // Para cada proyecto, cargamos y ordenamos los módulos, tareas y subtareas
        proyectos.forEach(proyecto -> {
            // Obtener módulos ordenados por idModuloOrden descendente
            List<Modulo> modulos = moduloRepository.findByProyectoIdOrderByIdModuloOrdenDesc(proyecto.getId());
            proyecto.setModulos(modulos);

            // Para cada módulo, obtener tareas ordenadas
            modulos.forEach(modulo -> {
                List<Tarea> tareas = tareaRepository.findByModuloIdOrderByIdTareaOrdenDesc(modulo.getId());
                modulo.setTareas(tareas);

                // Para cada tarea, obtener subtareas ordenadas
                tareas.forEach(tarea -> {
                    List<Subtarea> subtareas = subtareaRepository.findByModuloIdOrderByIdTareaOrdenDesc(tarea.getId());
                    tarea.setSubtareas(subtareas);
                });
            });
        });

        return proyectos;
    }


    // Actualizar una tarea
    public Proyecto actualizarTarea(Proyecto tarea) {
        return proyectoRepository.save(tarea);
    }


    @Transactional
    public Proyecto moverProyectoAPosicion(Long idProyecto, int nuevaPosicion) {
        // Buscar el proyecto por ID, asegurándose de que cumpla las condiciones
        Optional<Proyecto> proyectoOptional = proyectoRepository.findByIdAndEliminadoAndEstadoNot(
                idProyecto, false, EstadoProyecto.ARCHIVADO
        );

        if (proyectoOptional.isEmpty()) {
            throw new EntityNotFoundException("El proyecto no existe o no cumple las condiciones");
        }

        Proyecto proyecto = proyectoOptional.get();

        Long idProyectoOrdenActual = proyecto.getIdProyectoOrden();


        // Si la nueva posición es mayor que la actual (mover hacia abajo)
        if (nuevaPosicion > idProyectoOrdenActual) {
            // Decrementamos las posiciones de los proyectos entre la nueva posición y la posición actual
            proyectoRepository.decrementarPosiciones(idProyectoOrdenActual + 1, nuevaPosicion);
        } else if (nuevaPosicion < idProyectoOrdenActual) { // Si la nueva posición es menor que la actual (mover hacia arriba)
            // Incrementamos las posiciones de los proyectos entre la nueva posición y la posición actual
            proyectoRepository.incrementarPosiciones(nuevaPosicion, idProyectoOrdenActual - 1);
        }

        // Actualizamos la posición del proyecto en cuestión
        proyectoRepository.actualizarPosicionProyecto(idProyecto, nuevaPosicion);

        return proyectoRepository.findById(idProyecto).orElse(null);
    }

    @Transactional
    public boolean eliminarProyecto(Long id) {
        // Buscar el proyecto por ID
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(id);

        if (proyectoOptional.isEmpty()) {
            throw new EntityNotFoundException("El proyecto no existe");
        }

        Proyecto proyecto = proyectoOptional.get();
        Long idProyectoOrdenActual = proyecto.getIdProyectoOrden();

        // Mover el proyecto a la papelera
        proyecto.setUserDelete(authService.obtenerNombreYApellido());
        proyecto.setDeleteAt(new Date());
        proyecto.moverAPapelera();
        proyecto.setIdProyectoOrden(0L);
        proyectoRepository.save(proyecto);

        // Reorganizar las posiciones de los proyectos restantes para cubrir el hueco
        proyectoRepository.decrementarPosiciones(idProyectoOrdenActual + 1, Integer.MAX_VALUE);

        return true;
    }

    //ARCHIVAR PROYECTO
    @Transactional
    public boolean cambiarEstadoProyecto(Long id, EstadoProyecto nuevoEstado) {
        // Buscar el proyecto por ID
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El proyecto no existe"));

        Long idProyectoOrdenActual = proyecto.getIdProyectoOrden();

        // Actualizar el estado del proyecto
        proyecto.setEstado(nuevoEstado);

        if (nuevoEstado.equals(EstadoProyecto.ARCHIVADO)) {
            proyecto.setArchivarAt(new Date());
            proyecto.setArchivarDelete(authService.obtenerNombreYApellido());
            proyecto.setIdProyectoOrden(0L);
        }

        proyectoRepository.save(proyecto); // Guardar los cambios en el proyecto

        // Si el estado es ARCHIVADO, reorganizar los proyectos restantes
        if (nuevoEstado.equals(EstadoProyecto.ARCHIVADO)) {
            proyectoRepository.decrementarPosiciones(idProyectoOrdenActual + 1, Integer.MAX_VALUE);
        }

        return true;
    }



    //ACTUALIZR NOMBRE PROYECTO
    public Proyecto actualizarFechaInicioProyecto(Long id, Proyecto proyecto) {
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(id);

        if (proyectoOptional.isPresent()) {
            Proyecto proyectoActual = proyectoOptional.get();

            // Actualizar los campos del proyecto
            proyectoActual.setFechaInicio(proyecto.getFechaInicio());
            proyectoActual.setUserModify(authService.obtenerNombreYApellido());
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

            proyectoActual.setUserModify(authService.obtenerNombreYApellido());
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
            proyectoActual.setUserModify(authService.obtenerNombreYApellido());
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
        proyecto.setUserCreate(authService.obtenerNombreYApellido());  // Aquí se usa el nombre del usuario autenticado
        proyecto.setCreateAt(new Date());


        // Obtener todos los valores de idProyectoOrden
        List<Long> idsExistentes = proyectoRepository.findAllIdProyectoOrden();

        // Si la lista está vacía, asignamos el valor 1
        long siguienteId = 1L;
        if (!idsExistentes.isEmpty()) {
            // Ordenamos los valores de menor a mayor
            Collections.sort(idsExistentes);

            // El siguiente valor será el último valor más uno
            siguienteId = idsExistentes.get(idsExistentes.size() - 1) + 1;
        }

        proyecto.setIdProyectoOrden(siguienteId);


        return proyectoRepository.save(proyecto);
    }


    //RESATURAR DE PAPELERA
    @Transactional
    public boolean restaurarProyecto(Long id) {
        // Buscar el proyecto por ID
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El proyecto no existe en la papelera"));

        // Restaurar el proyecto desde la papelera
        proyecto.restaurarDePapelera();

        // Obtener el valor máximo actual de idProyectoOrden
        Long maxIdProyectoOrden = proyectoRepository.findMaxIdProyectoOrden();
        long siguienteId = (maxIdProyectoOrden != null) ? maxIdProyectoOrden + 1 : 1L;

        // Asignar el siguiente ID al proyecto restaurado
        proyecto.setIdProyectoOrden(siguienteId);

        // Guardar el proyecto restaurado
        proyectoRepository.save(proyecto);

        return true;
    }


    // RESTAURAR PROYECTO DE ARCHIVADO
    public boolean restaurarProyectoNoArchivado(Long id) {
        // Buscar el proyecto por ID
        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El proyecto no existe en la papelera"));

        proyecto.setEstado(EstadoProyecto.COMPLETADO);  // Actualizar el estado del proyecto

        // Obtener el valor máximo actual de idProyectoOrden
        Long maxIdProyectoOrden = proyectoRepository.findMaxIdProyectoOrden();
        long siguienteId = (maxIdProyectoOrden != null) ? maxIdProyectoOrden + 1 : 1L;


        // Asignar el siguiente ID al proyecto restaurado
        proyecto.setIdProyectoOrden(siguienteId);

        proyectoRepository.save(proyecto);

        // Retornar true si la restauración fue exitosa
        return true;
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

    private String generarColorAleatorio() {
        int color = (int) (Math.random() * 0xFFFFFF);
        return String.format("#%06X", color);

    }


//    public List<Proyecto> listarProyectosNoArchivados() {
//        // Obtener los proyectos no archivados sin eliminar y ordenarlos por idProyectoOrden en orden ascendente
//        List<Proyecto> proyectos = proyectoRepository.findByEstadoNotAndEliminadoFalse(
//                EstadoProyecto.ARCHIVADO,
//                Sort.by(Sort.Direction.DESC, "idProyectoOrden")
//        );
//
//
//        // Ordenar los módulos, tareas y subtareas dentro de cada proyecto en orden descendente
//        proyectos.forEach(proyecto -> {
//            // Ordenar módulos en orden descendente por "id"
//            proyecto.getModulos().sort(Comparator.comparing(Modulo::getId).reversed());
//
//            proyecto.getModulos().forEach(modulo -> {
//                // Ordenar tareas dentro de cada módulo en orden descendente por "id"
//                modulo.getTareas().sort(Comparator.comparing(Tarea::getId).reversed());
//
//                // Ordenar subtareas dentro de cada tarea en orden descendente por "id"
//                modulo.getTareas().forEach(tarea ->
//                        tarea.getSubtareas().sort(Comparator.comparing(Subtarea::getId).reversed())
//                );
//            });
//        });
//
//        return proyectos;
//    }


    public List<Proyecto> listarProyectosArchivados() {
        return proyectoRepository.findByEstado(EstadoProyecto.ARCHIVADO);
    }

    public List<Proyecto> listarProyectosElimindos() {
        return proyectoRepository.findByEliminadoTrue();
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
        proyecto.setUserModify(authService.obtenerNombreYApellido());

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

