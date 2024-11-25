package com.codigo.msregistro.application.services;

import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Verifica si el email ya existe
    public boolean emailExists(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }
    // Crear una nueva tarea
    public Usuario crearUsuario(Usuario usuario) {
        usuario.setFechaRegistro(new Date());
        usuario.setActivo(true);
       // usuario.setRol(RolUsuario.DESARROLLADOR);
        // Asignar color de fondo aleatorio
        usuario.setBackgroundUser(generarColorAleatorio());

        return usuarioRepository.save(usuario);
    }

    private String generarColorAleatorio() {
        int color = (int) (Math.random() * 0xFFFFFF);
        return String.format("#%06X", color);
    }
    public Usuario buscarPorEmail(String email) {
        // Utilizamos el método findByEmail y verificamos si el usuario existe
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        // Si el usuario está presente, lo retornamos, de lo contrario retornamos null o lanzar una excepción
        return usuarioOpt.orElse(null); // O puedes lanzar una excepción si prefieres manejarlo de esa manera
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

    public Usuario actualizarEstadoActivo(Long id, Boolean activo) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setActivo(activo); // Actualiza el estado activo
            return usuarioRepository.save(usuario); // Guarda los cambios en la base de datos
        }
        return null; // O lanza una excepción si el usuario no existe
    }


    //CAMBIAR ROL
}
