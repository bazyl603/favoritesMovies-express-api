import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from './Movie';

@Entity()
export class Character {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    link!: string;

    @ManyToMany(() => Movie, (movie) => movie.characters)
    movies!: Movie[];
}