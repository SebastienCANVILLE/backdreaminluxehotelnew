import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from "src/enum/user-role.enum";


@Entity('users')
export class User extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @ApiProperty()
    @Column()
    //@Exclude()
    password: string;

    @ApiProperty()
    @Column()
    //@Exclude()
    salt: string;

    @ApiProperty()
    @Column()
    firstname: string;

    @ApiProperty()
    @Column()
    lastname: string;

    @ApiProperty()
    @Column()
    adress_line: string;

    @ApiProperty()
    @Column()
    zipCode: string;

    @ApiProperty()
    @Column()
    city: string;

    @ApiProperty()
    @Column()
    country: string;

    @ApiProperty()
    @Column()
    phone_number: string;

    @ApiProperty()
    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER
    })
    @Exclude()
    role: string;

}


