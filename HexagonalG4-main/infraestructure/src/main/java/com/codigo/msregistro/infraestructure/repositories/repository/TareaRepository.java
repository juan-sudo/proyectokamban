package com.codigo.msregistro.infraestructure.repositories.repository;

import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Tarea;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findAll(Sort sort);
    // Encontrar todas las tareas por módulo
    List<Tarea> findByModulo(Modulo modulo);

    @Query("SELECT t FROM Tarea t WHERE t.modulo.id = :idtarea ORDER BY t.id DESC")
    List<Tarea> findByTareaIdOrderByIdDesc(Long idtarea);


    @Modifying
    @Transactional
    @Query("UPDATE Tarea t SET t.idTareaOrden = t.idTareaOrden + 1 " +
            "WHERE t.modulo.id = :idModulo AND t.idTareaOrden >= :inicio AND t.idTareaOrden < :fin")
    void incrementarPosiciones(Long idModulo, int inicio, Long fin);


    @Modifying
    @Transactional
    @Query("UPDATE Tarea t  SET t.idTareaOrden  = t.idTareaOrden  - 1 " +
            "WHERE t.modulo.id= :idModulo AND t.idTareaOrden >= :inicio AND t.idTareaOrden<= :fin")
    void decrementarPosiciones(Long idModulo, Long inicio, int fin);


    @Modifying
    @Transactional
    @Query("UPDATE Tarea t SET t.idTareaOrden  = :nuevaPosicion WHERE t.id= :idTarea")
    void actualizarPosicionTarea(Long idTarea, int nuevaPosicion);


    // Lista de tareas de un modulo ordenados por idTareaOrden
    @Query("SELECT t FROM Tarea t WHERE t.modulo.id = :idModulo ORDER BY t.idTareaOrden DESC")
    List<Tarea> findByModuloIdOrderByIdTareaOrdenDesc(Long idModulo);



}
