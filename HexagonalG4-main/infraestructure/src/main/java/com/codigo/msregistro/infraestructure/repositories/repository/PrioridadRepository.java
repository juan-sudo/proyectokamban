package com.codigo.msregistro.infraestructure.repositories.repository;

import com.codigo.msregistro.domain.aggregates.Prioridad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrioridadRepository extends JpaRepository<Prioridad, Long> {

}
