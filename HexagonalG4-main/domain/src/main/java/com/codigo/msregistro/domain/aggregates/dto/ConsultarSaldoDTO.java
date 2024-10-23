package com.codigo.msregistro.domain.aggregates.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConsultarSaldoDTO {
    private String numeroCuenta;
    private String numeroDoc;
    private String tipoCuenta;
    private double saldo;
}
