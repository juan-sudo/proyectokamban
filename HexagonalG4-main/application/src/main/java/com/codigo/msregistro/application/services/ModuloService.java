package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.ModuloRepository;
import com.codigo.msregistro.infraestructure.repositories.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.ProyectoRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
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


    public Modulo crearModulo(Proyecto proyecto, Modulo modulo) {
        modulo.setProyecto(proyecto);
        modulo.setEstado(EstadoModulo.PENDIENTE);
        modulo.setUserCreate("salomon santa perez");
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
