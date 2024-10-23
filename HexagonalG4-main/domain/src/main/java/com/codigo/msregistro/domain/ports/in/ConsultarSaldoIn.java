package com.codigo.msregistro.domain.ports.in;

import com.codigo.msregistro.domain.aggregates.dto.ConsultarSaldoDTO;

public interface ConsultarSaldoIn {

    ConsultarSaldoDTO consultarSaldoIn(Long idCliente);

}
