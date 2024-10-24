package com.codigo.msregistro.domain.aggregates;

import com.fasterxml.jackson.annotation.JsonManagedReference; // Importación necesaria para evitar la recursión
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Id; // Import correcto para JPA





import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "proyectos")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nombre;

    @NotNull
    private String descripcion;

    @NotNull
    @Enumerated(EnumType.STRING)
    private EstadoProyecto estado;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaInicio;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaFin;


    private String prioridad;


    @ManyToMany
    @JoinTable(
            name = "proyecto_usuarios",
            joinColumns = @JoinColumn(name = "proyecto_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> usuarios = new ArrayList<>();

    @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // Evitar la recursión infinita al serializar
    private List<Modulo> modulos = new ArrayList<>();

    @Column(nullable = true)
    private Boolean eliminado;

    // Método para mover el proyecto a la papelera (eliminación lógica)
    public void moverAPapelera() {
        this.eliminado = true;
    }

    // Método para restaurar el proyecto desde la papelera
    public void restaurarDePapelera() {
        this.eliminado = false;
    }

    @PrePersist
    @PreUpdate
    private void preSave() {
        if (this.eliminado == null) {
            this.eliminado = false;  // Establecer como false si es null
        }
    }
}
