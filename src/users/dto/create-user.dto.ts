import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password_confirm: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    civility: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastname: string;

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
    country: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number: string;

}
