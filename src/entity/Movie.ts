import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./Character";
import { Favorite } from './Favorite';

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    releadeData!: Date;

    @Column({unique: true})
    title!: string;

    @ManyToMany(() => Favorite, (favorite) => favorite.movies)
    favorites!: Favorite[];

    @ManyToMany(() => Character, (character) => character.movies)
    characters!: Character[];
}