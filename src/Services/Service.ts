import axios from 'axios';
import Excel from 'exceljs';
import { Response } from "express";
import { Favorite } from '../entity/Favorite';
import { Movie } from './../entity/Movie';
import { Character } from './../entity/Character';

import IService, { Film } from "./IService";
import { ResultFilm } from './IResponse';
import myDataSource from '../dataSource';


export class Service implements IService{

    private filmsList: ResultFilm[] = [];

    async getFilms(): Promise<Film[]> {
        const response = await axios.get('https://swapi.dev/api/films/', {
            headers: {
                'Content-Type': 'application/json'
                }
            });

        this.filmsList = response.data.results;

        return this.filmsList.map(film => {
            return {
                id: film.episode_id,
                title: film.title,
                releaseDate: new Date(film.release_date),
            }
        }
        );
    }

    async saveFavorite(name: string, moviesID: number[]): Promise<Partial<Favorite>> {
        if(moviesID.length === 0) {
            throw new Error('No movies selected');
        }

        try{
            const eMovie = this.filmsList.filter(film => moviesID.includes(film.episode_id));
            if(eMovie.length === 0) {
                throw new Error('No movies selected');
            }

            const allMovies = await myDataSource.manager.getRepository(Movie).find();
            const allCharacters = await myDataSource.manager.getRepository(Character).find();

            let favorite = await myDataSource.manager.getRepository(Favorite).findOne({
                where: {
                    name: name
                }
            });

            if(favorite === undefined || favorite === null) {
                favorite = new Favorite();
                favorite.name = name;
            }

            favorite.movies = [];

            for(let i = 0; i < eMovie.length; i++) {
                let movie = allMovies.find(m => m.eid === eMovie[i].episode_id);

                if(movie === undefined || movie === null) {
                    movie = new Movie();
                    movie.eid = eMovie[i].episode_id;
                    movie.title = eMovie[i].title;
                    movie.releadeData = new Date(eMovie[i].release_date);
                    movie.characters = [];

                    for(let j = 0; j < eMovie[i].characters.length; j++) {
                        let character = allCharacters.find(c => c.link === eMovie[i].characters[j]);
                        if(character === undefined || character === null) {
                            character = new Character();
                            character.link = eMovie[i].characters[j];

                            const res = await axios.get(eMovie[i].characters[j], {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            character.name = res.data.name;

                            const ch = await myDataSource.manager.getRepository(Character).save(character);
                            movie.characters.push(ch);
                            allCharacters.push(ch);
                        }else{
                            movie.characters.push(character);
                            allCharacters.push(character);
                        }
                    }

                    const m = await myDataSource.manager.save(movie);
                    favorite.movies.push(m);
                    allMovies.push(m);
                }else {
                    favorite.movies.push(movie);
                    allMovies.push(movie);
                }
            }
          

            const fsave = await myDataSource.manager.getRepository(Favorite).save(favorite);

            return {
                id: fsave.id,
                name: fsave.name
            }
            
        }catch(e){
            throw new Error('database operation error');
        }
    }

    async getFavorites(page: number, search: string): Promise<[Favorite[], number]> {
        let skip = page - 1;
        if(skip < 0) {
            skip = 0;
        }
        skip = skip * 10;
        try{
            const favorites = await myDataSource.manager
                .getRepository(Favorite)
                .createQueryBuilder('favorite')
                .skip(skip)
                .take(10)
                .where('favorite.name LIKE :search', { search: `%${search}%` })
                .getManyAndCount();
            
            return favorites;
            
        }catch(e){
            throw new Error('database operation error');
        }
    }

    async getFavorite(id: number): Promise<Favorite | null> {
        try{
            const favorites = await myDataSource.manager
                .getRepository(Favorite)
                .createQueryBuilder('favorite')
                .leftJoinAndSelect('favorite.movies', 'movie')
                .leftJoinAndSelect('movie.characters', 'character')
                .where('favorite.id = :id', { id: id })
                .getOne();
            
            return favorites;
            
        }catch(e){
            throw new Error('database operation error');
        }
    }

    async getExcel(id: number, response: Response) {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Favorite ' + id);

        worksheet.columns = [
            { header: 'Character', key: 'character', width: 30 },
            { header: 'Movies', key: 'movies', width: 40 },
        ];

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                if(rowNumber === 1 || rowNumber === 2 && colNumber === 1) {
                    cell.style.font = { bold: true };
                }
            });
        });


        const favorite = await this.getFavorite(id);

        if(favorite !== null) {
            const nameCharacter: {character: string, movies: string[]}[] = [];
            for(let i = 0; i < favorite.movies.length; i++) {
                for(let j = 0; j < favorite.movies[i].characters.length; j++) {                    

                    let character = nameCharacter.find(c => c.character === favorite.movies[i].characters[j].name);
                    if(character === undefined || character === null) {
                        character = {
                            character: favorite.movies[i].characters[j].name,
                            movies: [favorite.movies[i].title]
                        }
                        nameCharacter.push(character);
                    }else{
                        character.movies.push(favorite.movies[i].title);
                    }
                }
            }

           nameCharacter.forEach(character => {
                worksheet.addRow({
                    character: character.character,
                    movies: character.movies.join(', ')
                });
            });

            return workbook.xlsx.write(response);
        }else{
            throw new Error('No favorite found');
        }
    }

}