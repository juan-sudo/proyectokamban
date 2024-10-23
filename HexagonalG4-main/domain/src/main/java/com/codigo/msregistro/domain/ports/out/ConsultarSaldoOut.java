package com.codigo.msregistro.domain.ports.out;

import com.codigo.msregistro.domain.aggregates.dto.ConsultarSaldoDTO;

public interface ConsultarSaldoOut {
    ConsultarSaldoDTO consultarSaldoOut(Long idCliente);

}
