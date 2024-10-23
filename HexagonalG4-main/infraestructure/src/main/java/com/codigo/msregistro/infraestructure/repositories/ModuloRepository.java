package com.codigo.msregistro.infraestructure.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.codigo.msregistro.domain.aggregates.Modulo;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {
}
