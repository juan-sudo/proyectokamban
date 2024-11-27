package com.codigo.msregistro.infraestructure.repositories.repository;

import org.springframework.transaction.annotation.Transactional;
import com.codigo.msregistro.domain.aggregates.Modulo;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {

    // Método para listar proyectos cuyo estado es diferente de ARCHIVADO y ordenados
    List<Modulo> findAll(Sort sort);

    @Modifying
    @Transactional
    @Query("UPDATE Modulo m SET m.idModuloOrden = m.idModuloOrden + 1 " +
            "WHERE m.proyecto.id = :idProyecto AND m.idModuloOrden >= :inicio AND m.idModuloOrden < :fin")
    void incrementarPosiciones(Long idProyecto, int inicio, Long fin);


    @Modifying
    @Transactional
    @Query("UPDATE Modulo m SET m.idModuloOrden = m.idModuloOrden - 1 " +
            "WHERE m.proyecto.id = :idProyecto AND m.idModuloOrden >= :inicio AND m.idModuloOrden <= :fin")
    void decrementarPosiciones(Long idProyecto, Long inicio, int fin);


    @Modifying
    @Transactional
    @Query("UPDATE Modulo m SET m.idModuloOrden = :nuevaPosicion WHERE m.id = :idModulo")
    void actualizarPosicionModulo(Long idModulo, int nuevaPosicion);



    // Lista de módulos de un proyecto ordenados por idModuloOrden
    @Query("SELECT m FROM Modulo m WHERE m.proyecto.id = :idProyecto ORDER BY m.idModuloOrden DESC")
    List<Modulo> findByProyectoIdOrderByIdModuloOrdenDesc(Long idProyecto);



}
