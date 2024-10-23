package com.codigo.msregistro.domain.aggregates;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "subtareas")
public class Subtarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nombre;

    @NotNull
    private String descripcion;

    @NotNull
    @Enumerated(EnumType.STRING)
    private EstadoSubtarea estado;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaInicio;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaFin;


    private String prioridad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarea_id")
    @JsonIgnoreProperties("subtareas")// Relación ManyToOne con Tarea
    private Tarea tarea;  // Cada subtarea pertenece a una tarea

    @ManyToMany
    @JoinTable(
            name = "subtarea_usuarios",
            joinColumns = @JoinColumn(name = "subtarea_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> usuarios = new ArrayList<>();
}
