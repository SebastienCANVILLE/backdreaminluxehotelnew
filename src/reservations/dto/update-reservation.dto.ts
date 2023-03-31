import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    arrival_date: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    departure_date: Date;

    @IsNumber()
    roomId: number
}
