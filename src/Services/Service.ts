import axios from 'axios';

import IService, { Film } from "./IService";
import { Result } from './IResponse';

export class Service implements IService{

    async getFilms(): Promise<Film[]> {
        const response = await axios.get('https://swapi.dev/api/films/', {
            headers: {
                'Content-Type': 'application/json'
                }
            });

        const films: Result[] = response.data.results;
        console.log(films);
        return films.map(film => {
            return {
                id: film.episode_id,
                title: film.title,
                releaseDate: new Date(film.release_date),
            }
        }
        );
    }
        
}