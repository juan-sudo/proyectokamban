package com.codigo.msregistro.domain.aggregates;
// Importa la clase correcta

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;  // Import necesario para evitar la recursión
import jakarta.persistence.*;
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
@Table(name = "tareas")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nombre;
    @NotNull
    private String descripcion;
    @NotNull
    @Enumerated(EnumType.STRING)
    private EstadoTarea estado;

    @NotNull
    @Column(name = "fecha_inicio")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaInicio;

    @NotNull
    @Column(name = "fecha_fin")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date fechaFin;


    private String prioridad;

    @ManyToOne
    @JoinColumn(name = "modulo_id")
    @JsonBackReference  // Evitar la recursión al serializar
    private Modulo modulo;  // Este campo representa la relación con el Módulo

    // Relación unidireccional muchos a muchos con Usuario
    @ManyToMany
    @JoinTable(
            name = "tarea_usuario",
            joinColumns = @JoinColumn(name = "tarea_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> usuarios = new ArrayList<>();

    @OneToMany(mappedBy = "tarea", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subtarea> subtareas;


}
