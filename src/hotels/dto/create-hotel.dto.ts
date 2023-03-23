import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateHotelDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name_hotel: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    adress_line: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    zipCode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number: string;

}

