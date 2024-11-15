package com.codigo.msregistro.domain.util;

public class AppUtil {
    /**
     * Valida si un String es nulo o está vacío.
     *
     * @param value el String a validar
     * @return true si el String no es nulo ni está vacío, false en caso contrario
     */
    public static boolean isNotNullOrEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

}
