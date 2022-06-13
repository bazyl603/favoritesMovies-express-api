import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from './Movie';

@Entity()
export class Favorite {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    name!: string;

    @ManyToMany(() => Movie, (movie) => movie.favorites)
    movies!: Movie[];
}