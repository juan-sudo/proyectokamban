package com.codigo.msregistro.infraestructure.repositories.repository;

import com.codigo.msregistro.domain.aggregates.Subtarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SubtareaRepository extends JpaRepository<Subtarea, Long> {
    List<Subtarea> findByTarea(Tarea tarea);

    List<Subtarea> findAll(Sort sort);

    @Query("SELECT s FROM Subtarea s WHERE s.tarea.id = :idTarea ORDER BY s.id DESC")
    List<Subtarea> findByTareaIdOrderByIdDesc(Long idTarea);


    @Modifying
    @Transactional
    @Query("UPDATE Subtarea s SET s.idSubtareaOrden = s.idSubtareaOrden + 1 " +
            "WHERE s.tarea.id = :idTarea AND s.idSubtareaOrden >= :inicio AND s.idSubtareaOrden < :fin")
    void incrementarPosiciones(Long idTarea, int inicio, Long fin);


    @Modifying
    @Transactional
    @Query("UPDATE Subtarea s SET s.idSubtareaOrden   = s.idSubtareaOrden   - 1 " +
            "WHERE s.tarea.id= :idTarea AND s.idSubtareaOrden  >= :inicio AND s.idSubtareaOrden <= :fin")
    void decrementarPosiciones(Long idTarea, Long inicio, int fin);


    @Modifying
    @Transactional
    @Query("UPDATE Subtarea s SET  s.idSubtareaOrden   = :nuevaPosicion WHERE s.id= :idSubTarea")
    void actualizarPosicionTarea(Long idSubTarea, int nuevaPosicion);


    // Lista de tareas de un modulo ordenados por idTareaOrden
    @Query("SELECT s FROM Subtarea s WHERE s.tarea.id = :idTarea ORDER BY s.idSubtareaOrden  DESC")
    List<Subtarea> findByModuloIdOrderByIdTareaOrdenDesc(Long idTarea);


}
