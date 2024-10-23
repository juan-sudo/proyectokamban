package com.codigo.msregistro.infraestructure.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "persona")
@Data
public class PersonaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_persona")
    private Long idPersona;

    @Column(name = "num_docu", nullable = false, length = 15)
    private String numDocu;

    @Column(name = "nombres", nullable = false, length = 150)
    private String nombres;

    @Column(name = "ape_pat", nullable = false, length = 150)
    private String apePat;

    @Column(name = "ape_mat", nullable = false, length = 150)
    private String apeMat;

    @Column(name = "estado", nullable = false)
    private Integer estado;

    @Column(name = "usua_crea", length = 45, nullable = false, updatable = false)
    private String usuaCrea;

    @CreationTimestamp
    @Column(name = "date_create", nullable = false, updatable = false)
    private Timestamp dateCreate;

    @Column(name = "usua_modif", length = 45)
    private String usuaModif;

    @UpdateTimestamp
    @Column(name = "date_modif")
    private Timestamp dateModif;

    @Column(name = "usua_delet", length = 45)
    private String usuaDelet;

    @Column(name = "date_delet")
    private Timestamp dateDelet;



    @ManyToOne(optional = false)
    @JoinColumn(name = "tipo_documento_id", nullable = false)
    private TipoDocumentoEntity tipoDocumento;

    // Método auxiliar para marcar la eliminación lógica
    public void marcarEliminado(String usuarioDelet) {
        this.usuaDelet = usuarioDelet;
        this.dateDelet = new Timestamp(System.currentTimeMillis());
    }
}
