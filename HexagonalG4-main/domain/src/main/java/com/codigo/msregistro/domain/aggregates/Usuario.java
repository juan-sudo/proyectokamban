package com.codigo.msregistro.domain.aggregates;

import jakarta.persistence.*;  // Importación correcta de JPA
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String nombre;

    private String email;

    @Enumerated(EnumType.STRING) // Almacenar el enum como un string en la base de datos
    private RolUsuario rol; // Enum para roles (definirlo por separado)
}
