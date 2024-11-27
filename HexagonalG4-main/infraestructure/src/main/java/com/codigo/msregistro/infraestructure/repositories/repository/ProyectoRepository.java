package com.codigo.msregistro.infraestructure.repositories.repository;

import com.codigo.msregistro.domain.aggregates.EstadoProyecto;
import com.codigo.msregistro.domain.aggregates.Proyecto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    @Query("SELECT MAX(p.idProyectoOrden) FROM Proyecto p")
    Long findMaxIdProyectoOrden();

    Proyecto findByIdProyectoOrden(Long idProyectoOrden);

    // Encontrar proyectos que no están eliminados
    List<Proyecto> findByEliminadoFalse();

    // Encontrar proyectos que están en la papelera
    List<Proyecto> findByEliminadoTrue();

    // Método para listar proyectos cuyo estado es diferente de ARCHIVADO y eliminado es false
    List<Proyecto> findByEstadoNotAndEliminadoFalse(EstadoProyecto estado, Sort sort);


    // Método para listar proyectos cuyo estado es ARCHIVADO
    List<Proyecto> findByEstado(EstadoProyecto estado);

    @Query("SELECT p FROM Proyecto p WHERE p.id = :id AND p.eliminado = :eliminado AND p.estado != :estado")
    Optional<Proyecto> findByIdAndEliminadoAndEstadoNot(Long id, Boolean eliminado, EstadoProyecto estado);

    // Incrementar las posiciones de los proyectos entre la nueva posición y la posición actual
    @Modifying
    @Query("UPDATE Proyecto p SET p.idProyectoOrden = p.idProyectoOrden + 1 " +
            "WHERE p.idProyectoOrden >= :inicio AND p.idProyectoOrden <= :fin")
    void incrementarPosiciones(int inicio, Long fin);

    // Decrementar las posiciones de los proyectos entre la posición actual y la nueva
    @Modifying
    @Query("UPDATE Proyecto p SET p.idProyectoOrden = p.idProyectoOrden - 1" +
            " WHERE p.idProyectoOrden >= :inicio AND p.idProyectoOrden <= :fin")
    void decrementarPosiciones(Long inicio, int fin);


    @Modifying
    @Query("UPDATE Proyecto p SET p.idProyectoOrden = :nuevaPosicion WHERE p.id = :id")
    void actualizarPosicionProyecto(Long id, int nuevaPosicion);

    @Query("SELECT p.idProyectoOrden FROM Proyecto p ORDER BY p.idProyectoOrden ASC")
    List<Long> findAllIdProyectoOrden();

}


