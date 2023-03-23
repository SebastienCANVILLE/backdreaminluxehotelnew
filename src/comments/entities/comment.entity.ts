import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('comments')
export class Comment extends BaseEntity{

@ApiProperty()
@PrimaryGeneratedColumn()
id: number;

@ApiProperty()
@Column()
commentary: string;

}