package com.codigo.msregistro.infraestructure.adapters;

import com.codigo.msregistro.domain.aggregates.constants.Constants;
import com.codigo.msregistro.domain.aggregates.dto.PersonaDTO;

import com.codigo.msregistro.domain.aggregates.dto.PersonaDTO;
import com.codigo.msregistro.domain.aggregates.dto.ReniecDTO;
import com.codigo.msregistro.domain.aggregates.request.PersonaRequest;
import com.codigo.msregistro.domain.ports.out.PersonaServiceOut;
import com.codigo.msregistro.infraestructure.client.ClientReniec;
import com.codigo.msregistro.infraestructure.dao.PersonaRepository;
import com.codigo.msregistro.infraestructure.entity.PersonaEntity;
import com.codigo.msregistro.infraestructure.entity.TipoDocumentoEntity;
import com.codigo.msregistro.infraestructure.mapper.PersonaMapper;
import com.codigo.msregistro.infraestructure.redis.RedisService;
import com.codigo.msregistro.infraestructure.util.Util;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonaAdapter implements PersonaServiceOut {

    private final PersonaRepository personaRepository;
    private final ClientReniec clientReniec;
    private final RedisService redisService;

    @Value("${token.reniec}")
    private String tokenReniec;

    @Override
    public PersonaDTO crearPersonaOut(PersonaRequest personaRequest) {
        PersonaEntity personaEntity = getPersonaCreate(personaRequest);
        return PersonaMapper.fromEntity(personaRepository.save(personaEntity));
    }

    private PersonaEntity getPersonaCreate(PersonaRequest personaRequest) {
        //LLamando a mi metodo de apoyo que ejecuta la peticion en el cliente externo
        ReniecDTO reniecDTO = getExecutionReniec(personaRequest.getDni());

        PersonaEntity entity = new PersonaEntity();
        TipoDocumentoEntity tipoDocumento = new TipoDocumentoEntity();
        tipoDocumento.setIdTipoDocumento(Long.valueOf(personaRequest.getTipoDoc()));
        entity.setNumDocu(reniecDTO.getNumeroDocumento());
        entity.setNombres(reniecDTO.getNombres());
        entity.setApeMat(reniecDTO.getApellidoMaterno());
        entity.setApePat(reniecDTO.getApellidoPaterno());
        entity.setEstado(Constants.STATUS_ACTIVE);
        entity.setUsuaCrea(Constants.USU_ADMIN);
        entity.setDateCreate(getTimestamp());
        entity.setTipoDocumento(tipoDocumento);
        return entity;
    }

    private Timestamp getTimestamp(){
        long currenTIme = System.currentTimeMillis();
        return new Timestamp(currenTIme);
    }

    private ReniecDTO getExecutionReniec(String numero){
        String authorization = "Bearer "+tokenReniec;
        ReniecDTO datosReniec = clientReniec.getInfoReniec(numero,authorization);
        return datosReniec;
    }


    @Override
    public Optional<PersonaDTO> obtenerPersonaOut(Long id) {
        // Intenta obtener la entidad de la base de datos por ID
        return personaRepository.findById(id)
                .map(PersonaMapper::fromEntity); // Mapea la entidad a DTO si se encuentra
    }

//    @Override
//    public Optional<PersonaDTO> obtenerPersonaOut(Long id) {
//        String redisInfo = redisService.getFromRedis(Constants.REDIS_KEY_OBTENERPERSONA+id);
//
//        if(redisInfo != null){
//            PersonaDTO personaDTO = Util.convertirDesdeString(redisInfo, PersonaDTO.class);
//            return Optional.of(personaDTO);
//        }else{
//            PersonaDTO personaDTO = PersonaMapper.fromEntity(personaRepository.findById(id).get());
//            String dataParaRedis = Util.convertirAString(personaDTO);
//            redisService.saveInRedis(Constants.REDIS_KEY_OBTENERPERSONA+id,dataParaRedis,2);
//            return Optional.of(personaDTO);
//        }
//    }

    @Override
    public List<PersonaDTO> obtenerTodosOut() {
        return personaRepository.findAll()
                .stream()
                .map(PersonaMapper::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public PersonaDTO actualizarPersonaOut(Long id, PersonaRequest personaRequest) {
        return null;
    }

    @Override
    public PersonaDTO deleteOut(Long id) {
        return null;
    }
}
