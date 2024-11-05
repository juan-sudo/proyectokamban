    package com.codigo.msregistro.domain.aggregates;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonFormat;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotNull;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    import java.time.LocalDate;
    import java.time.ZonedDateTime;
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

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "tarea_id")
        @JsonIgnoreProperties("subtareas")// evita recursividad
        @JsonIgnore // Omitir tarea en la serialización
        private Tarea tarea;  // Cada subtarea pertenece a una tarea


        // Relación unidireccional muchos a muchos con Usuario
        @ManyToMany
        @JoinTable(
                name = "subtarea_usuario", // Nombre actualizado para reflejar la entidad "subtarea"
                joinColumns = @JoinColumn(name = "subtarea_id"),
                inverseJoinColumns = @JoinColumn(name = "usuario_id")
        )
        private List<Usuario> usuarios = new ArrayList<>();

        @Column(name = "create_at")
        private Date createAt;

        @Column(name = "user_create")
        private String UserCreate;

        @Column(name = "modify_at")
        private Date modifyAt;

        @Column(name = "user_modify")
        private String UserModify;

        @Column(name = "delete_at")
        private Date deleteAt;

        @Column(name = "user_delete")
        private String UserDelete;


    }
