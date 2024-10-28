package com.codigo.msregistro.infraestructure.repositories;

import com.codigo.msregistro.domain.aggregates.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.codigo.msregistro.domain.aggregates.Modulo;

import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {

}
