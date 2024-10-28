package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.*;
import com.codigo.msregistro.infraestructure.repositories.ModuloRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;


import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class ModuloService {

    private final ModuloRepository moduloRepository;
    private final UsuarioRepository usuarioRepository;


    public Modulo crearModulo(Proyecto proyecto, Modulo modulo) {
        modulo.setProyecto(proyecto);
        modulo.setEstado(EstadoModulo.PENDIENTE);
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


    // Otros métodos como actualizar, eliminar, etc.
}
