package com.codigo.msregistro.domain.aggregates;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;  // Importación correcta de JPA
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity // Marca la clase como una entidad JPA
@Table(name = "usuarios") // Define el nombre de la tabla en la base de datos
public class Usuario {

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

    @NotNull
    @NotBlank
    @Column(name = "direccion", length = 255)
    private String direccion;

    @NotNull
    @Column(name = "nacimiento")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaNacimiento;

    @NotNull
    @NotBlank
    @Column(name = "genero", length = 1)
    private String genero;

    @NotNull
    @NotBlank
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private Date fechaRegistro;

    @NotNull
    @NotBlank
    @Column(name = "background_user", length = 7)
    private String backgroundUser;

    @NotNull
    @NotBlank
    private Boolean activo;

    @Enumerated(EnumType.STRING) // Almacenar el enum como un string en la base de datos
    private RolUsuario rol; // Enum para roles (definirlo por separado)
}
