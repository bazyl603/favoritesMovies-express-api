import axios from 'axios';
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

    async getFavorites(page: number, search: string) {
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
            
                console.log(favorites);
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
                .where('favorite.id = :id', { id: id })
                .getOne();
            console.log(favorites);
            return favorites;
            
        }catch(e){
            throw new Error('database operation error');
        }
    }

}