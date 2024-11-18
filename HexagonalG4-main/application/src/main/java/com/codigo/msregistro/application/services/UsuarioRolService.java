package com.codigo.msregistro.application.services;

import com.codigo.msregistro.domain.aggregates.Rol;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.RolRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@Service

@RequiredArgsConstructor
public class UsuarioRolService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    @Transactional
    public void actualizarRoles(Long userId, Set<Long> rolesIds) {
        // Buscar el usuario por ID
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        // Buscar los roles por IDs
        Set<Rol> nuevosRoles = new HashSet<>(rolRepository.findAllById(rolesIds));
        if (nuevosRoles.isEmpty()) {
            throw new NoSuchElementException("Roles no encontrados");
        }

        // Actualizar los roles del usuario
        usuario.setRoles(nuevosRoles);

        // Guardar los cambios
        usuarioRepository.save(usuario);
    }

    @Transactional
    public List<Rol> listaRol(){
        return rolRepository.findAllByOrderByIdRolAsc();
    }

}
