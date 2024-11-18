package com.codigo.msregistro.application.controller;


import com.codigo.msregistro.application.services.AuthenticationService;
import com.codigo.msregistro.application.services.UsuarioRolService;
import com.codigo.msregistro.application.services.UsuarioService;
import com.codigo.msregistro.domain.aggregates.Rol;
import com.codigo.msregistro.domain.aggregates.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/usuariosrol")
@RequiredArgsConstructor
public class UsuarioRolController {
    private final AuthenticationService authenticationService;
private final UsuarioRolService usuarioRolService;

    @GetMapping("/todos")
    public ResponseEntity<List<Usuario>> getTodos(){

        return ResponseEntity.ok(authenticationService.todos());
    }

    //ACTUALIZAR ROL
    @PutMapping("/{id}/roles")
    public ResponseEntity<String> actualizarRoles(
            @PathVariable Long id,
            @RequestBody Set<Long> rolesIds) {
        usuarioRolService.actualizarRoles(id, rolesIds);
        return ResponseEntity.ok("Roles actualizados correctamente");
    }

    //TODOS ROLES
    @GetMapping("/roles")
    public ResponseEntity<List<Rol>> getUsuariosRol() {
        return ResponseEntity.ok().body(usuarioRolService.listaRol());
    }

}
