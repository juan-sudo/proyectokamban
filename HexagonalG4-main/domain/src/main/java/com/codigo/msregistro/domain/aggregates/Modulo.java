package com.codigo.msregistro.domain.aggregates;


import com.fasterxml.jackson.annotation.JsonBackReference;  // Import necesario para evitar la recursión
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;  // Importar solo jakarta.persistence
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "modulos")
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nombre;

    @NotNull
    private String descripcion;

    @NotNull
    @Enumerated(EnumType.STRING)
    private EstadoModulo estado;

    @NotNull
    @Column(name = "fecha_inicio")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaInicio;

    @NotNull
    @Column(name = "fecha_fin")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaFin;

    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prioridad_id") // Columna que almacena la relación
    private Prioridad prioridad; // Relación con la clase Prioridad

    // Relación unidireccional muchos a muchos con Usuario
    @ManyToMany
    @JoinTable(
            name = "modulo_usuario",
            joinColumns = @JoinColumn(name = "modulo_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> usuarios = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id")
    @JsonBackReference  // Evitar la recursión infinita al serializar
    private Proyecto proyecto;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // Evitar la recursión al serializar
    private List<Tarea> tareas;  // Agregar este campo

    // Otros atributos y métodos
}
