package com.codigo.msregistro.application.services;

import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Tarea;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.TareaRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Crear una nueva tarea
    public Usuario crearUsuario(Usuario tarea) {
        return usuarioRepository.save(tarea);
    }


    // Obtener una tarea por ID
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Actualizar una tarea
    public Usuario actualizarUsuario(Usuario tarea) {
        return usuarioRepository.save(tarea);
    }
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

}
