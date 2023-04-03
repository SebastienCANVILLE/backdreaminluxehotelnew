import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReservationDto {

   /*  @ApiProperty()
    @IsString()    
    reference: string; */

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    arrival_date: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    departure_date: Date;

    @ApiProperty()
    @IsNumber()
    roomId: number
}
