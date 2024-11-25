package com.codigo.msregistro.application.controller;

import org.springframework.security.core.Authentication;
import com.codigo.msregistro.application.exceptions.EmailAlreadyExistsException;
import com.codigo.msregistro.application.services.AuthenticationService;
import com.codigo.msregistro.application.services.UsuarioService;
import com.codigo.msregistro.domain.aggregates.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final AuthenticationService authenticationService;
    private final UsuarioService usuarioService;

    // Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Método para obtener el usuario autenticado y sus roles
    @GetMapping("/getCurrentUser")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String username = authentication.getName(); // El nombre del usuario autenticado

            // Cargar el usuario desde el servicio con sus detalles
            Usuario usuario = authenticationService.getUserDetailsByUsername(username);

            // Obtener los roles del usuario autenticado
            Set<String> roles = usuario.getRolesNames();

            // Devolver el usuario junto con sus roles
            return ResponseEntity.ok(Map.of(
                    "usuario", usuario,
                    "roles", roles
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
    }

    // Crear un nuevo usuario
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        // Verifica si el email ya existe
        if (usuarioService.emailExists(usuario.getEmail())) {
            throw new EmailAlreadyExistsException("El email ya está registrado.");
        }
        Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }


    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(id);
        return usuarioOpt.map(usuario -> new ResponseEntity<>(usuario, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    // Actualizar un usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        usuario.setId(id); // Asegúrate de que el ID se establece en el objeto de usuario
        Usuario usuarioActualizado = usuarioService.actualizarUsuario(usuario);
        return new ResponseEntity<>(usuarioActualizado, HttpStatus.OK);
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(id);
        if (usuarioOpt.isPresent()) {
            usuarioService.eliminarUsuario(id); // Método que debes implementar en el servicio
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Actualizar el estado activo de un usuario
    @PutMapping("/{id}/estado")
    public ResponseEntity<Usuario> actualizarEstadoActivo(@PathVariable Long id, @RequestBody Map<String, Boolean> estado) {
        Boolean nuevoEstado = estado.get("activo"); // Obtener el nuevo estado del cuerpo de la solicitud
        Usuario usuarioActualizado = usuarioService.actualizarEstadoActivo(id, nuevoEstado);
        return usuarioActualizado != null ?
                new ResponseEntity<>(usuarioActualizado, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
