package com.codigo.msregistro.application.services;


import com.codigo.msregistro.domain.aggregates.Usuario;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UsuarioServicenuevo {
    UserDetailsService userDetailService();
    List<Usuario> getUsuarios();


}
