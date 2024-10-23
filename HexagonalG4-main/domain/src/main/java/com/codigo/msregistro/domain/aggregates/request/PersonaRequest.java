package com.codigo.msregistro.domain.aggregates.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonaRequest {
    private Integer tipoDoc;
    private String dni;
}
