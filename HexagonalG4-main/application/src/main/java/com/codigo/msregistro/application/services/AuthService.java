package com.codigo.msregistro.application.services;

import com.codigo.msregistro.domain.aggregates.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioService usuarioService;

    //public String obtenerUsuarioActual() {
      //  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //return authentication != null ? authentication.getName() : "Usuario desconocido";
    //}
    public String obtenerNombreYApellido() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String email = authentication.getName(); // El nombre de usuario es el correo electrónico

            // Cargar el usuario desde la base de datos usando el correo
            Usuario usuario = usuarioService.buscarPorEmail(email);

            if (usuario != null) {
                // Devolver el nombre completo
                return usuario.getNombres() ;
            }
        }
        return "Usuario desconocido";
    }
}
