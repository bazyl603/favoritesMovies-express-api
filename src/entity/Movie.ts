import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({unique: true})
    eid!: number;

    @ManyToMany(() => Favorite, (favorite) => favorite.movies)
    @JoinTable()
    favorites!: Favorite;

    @ManyToMany(() => Character, (character) => character.movies)
    @JoinTable()
    characters!: Character[];
}