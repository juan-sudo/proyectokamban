package com.codigo.msregistro.application.services.impl;


import com.codigo.msregistro.application.services.AuthenticationService;
import com.codigo.msregistro.application.services.JwtService;
import com.codigo.msregistro.application.services.UsuarioServicenuevo;
import com.codigo.msregistro.domain.aggregates.Rol;
import com.codigo.msregistro.domain.aggregates.Role;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.domain.aggregates.request.SignInRequest;
import com.codigo.msregistro.domain.aggregates.request.SignUpRequest;
import com.codigo.msregistro.domain.aggregates.response.AuthenticationResponse;
import com.codigo.msregistro.domain.util.AppUtil;
import com.codigo.msregistro.infraestructure.repositories.RolRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioServicenuevo usuarioService;
    private String generarColorAleatorio() {
        int color = (int) (Math.random() * 0xFFFFFF);
        return String.format("#%06X", color);
    }

    @Transactional
    @Override
    public Usuario signUpUser(SignUpRequest signUpRequest) {
        Usuario usuario = new Usuario();
        usuario.setNombres(signUpRequest.getNombres());
        usuario.setApellidoPaterno(signUpRequest.getApellidoPaterno());
        usuario.setApellidoMaterno(signUpRequest.getApellidoMaterno());
        usuario.setEmail(signUpRequest.getEmail());
        usuario.setTelefono(signUpRequest.getTelefono());
       usuario.setDireccion(signUpRequest.getDireccion());
       usuario.setFechaNacimiento(signUpRequest.getFechaNacimiento());
       usuario.setGenero(signUpRequest.getGenero());
        usuario.setFechaRegistro(new Date());
        usuario.setActivo(true);
        usuario.setBackgroundUser(generarColorAleatorio());

        Set<Rol> assginedRoles = new HashSet<>();
        Rol userRol = rolRepository.findByNombreRol(Role.DESARROLLADOR.name()).orElseThrow(() -> new RuntimeException("EL ROL NO EXISTE, REVISA TU BD"));
        assginedRoles.add(userRol);
        usuario.setRoles(assginedRoles);
        //HASH AL PASSWORD PENDIENTE
        usuario.setPassword(new BCryptPasswordEncoder().encode(signUpRequest.getPassword()));
        return usuarioRepository.save(usuario);
    }

    @Transactional
    @Override
    public Usuario signUpAdmin(SignUpRequest signUpRequest) {
        Usuario usuario = new Usuario();
        usuario.setNombres(signUpRequest.getNombres());
        usuario.setApellidoPaterno(signUpRequest.getApellidoPaterno());
        usuario.setApellidoMaterno(signUpRequest.getApellidoMaterno());
        usuario.setEmail(signUpRequest.getEmail());
        usuario.setTelefono(signUpRequest.getTelefono());
        usuario.setDireccion(signUpRequest.getDireccion());
        usuario.setFechaNacimiento(signUpRequest.getFechaNacimiento());
        usuario.setGenero(signUpRequest.getGenero());
        Set<Rol> assginedRoles = new HashSet<>();
        Rol userRol = rolRepository.findByNombreRol(Role.GESTOR.name()).orElseThrow(() -> new RuntimeException("EL ROL NO EXISTE, REVISA TU BD"));
        Rol userRol2 = rolRepository.findByNombreRol(Role.DESARROLLADOR.name()).orElseThrow(() -> new RuntimeException("EL ROL NO EXISTE, REVISA TU BD"));
        assginedRoles.add(userRol);
        assginedRoles.add(userRol2);
        usuario.setRoles(assginedRoles);
        //HASH AL PASSWORD PENDIENTE
        usuario.setPassword(new BCryptPasswordEncoder().encode(signUpRequest.getPassword()));
        return usuarioRepository.save(usuario);
    }

    @Override
    public List<Usuario> todos() {
        return usuarioRepository.findAll();
    }

    @Override
    public AuthenticationResponse signin(SignInRequest signInRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                signInRequest.getEmail(),signInRequest.getPassword()));
        var user = usuarioRepository.findByEmail(signInRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email no valido"));

        var token = jwtService.generateToken(user);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setToken(token);
        return authenticationResponse;
    }

    @Override
    public boolean validateToken(String token) {
        final String jwt;
        final String userEmail;
        if(AppUtil.isNotNullOrEmpty(token)){
            jwt =  token.substring(7);
            userEmail = jwtService.extractUserName(jwt);
            if (AppUtil.isNotNullOrEmpty(userEmail)){
                UserDetails userDetails = usuarioService.userDetailService().loadUserByUsername(userEmail);
                return jwtService.validateToken(jwt,userDetails);
            } else {
                return false;
            }
        } else {
            return false;
        }

    }
}
