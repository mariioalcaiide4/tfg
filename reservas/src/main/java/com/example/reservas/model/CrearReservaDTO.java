package com.example.reservas.model;

import lombok.Data;

@Data
public class CrearReservaDTO {
    
    private Long claseId;

}

/*
 *  Se crear una clase especifica para crear la reserva
 *  por seguridad para que el usuario no pueda modificar el 
 *  usuarioId, eso sería una mala práctica. Al igual que el estado
 *  y la fecha de reserva
 */