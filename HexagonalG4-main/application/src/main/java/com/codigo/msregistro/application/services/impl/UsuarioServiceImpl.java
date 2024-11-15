package com.codigo.msregistro.application.services.impl;

import com.codigo.msregistro.application.services.UsuarioServicenuevo;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioServicenuevo {
    private final UsuarioRepository usuarioRepository;
    @Override
    public UserDetailsService userDetailService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return usuarioRepository.findByEmail(username).orElseThrow(
                        () -> new UsernameNotFoundException("Usuario no encontrado"));
            }
        };
    }

    @Override
    public List<Usuario> getUsuarios() {
        return usuarioRepository.findAll();
    }
}
