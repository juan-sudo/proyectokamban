package com.codigo.msregistro.domain.aggregates;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity // Marca la clase como una entidad JPA
@Table(name = "usuarios") // Define el nombre de la tabla en la base de datos
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Genera automáticamente el ID
    private Long id;

    @NotNull
    @NotBlank
    private String nombres;

    @NotNull
    @NotBlank
    @Column(name = "apellido_parterno", nullable = false, length = 255)
    private String apellidoPaterno;

    @NotNull
    @NotBlank
    @Column(name = "apellido_materno", nullable = false, length = 255)
    private String apellidoMaterno;

    @NotNull
    @NotBlank
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @NotNull
    @NotBlank
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @NotNull
    @NotBlank
    @Column(name = "telefono", length = 20)
    private String telefono;


    @Column(name = "direccion", length = 255)
    private String direccion;


    @Column(name = "nacimiento")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaNacimiento;

    @NotNull
    @NotBlank
    @Column(name = "genero", length = 1)
    private String genero;

    @NotNull
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private Date fechaRegistro;

    @NotNull
    @NotBlank
    @Column(name = "background_user", length = 7)
    private String backgroundUser;

    @NotNull
    private Boolean activo;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuario_rol",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_rol"))
    private Set<Rol> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(rol -> new SimpleGrantedAuthority(rol.getNombreRol()))
                .collect(Collectors.toList());
    }

    public Set<String> getRolesNames() {
        return roles.stream().map(Rol::getNombreRol).collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
