import { Favorite } from "../entity/Favorite";

export interface Film {
    id: number,
    title: string,
    releaseDate: Date,
}

export default interface IService {
    getFilms(): Promise<Film[]>;
    saveFavorite(name: string, moviesID: number[]): Promise<Partial<Favorite>>;
    getFavorites(): Promise<Partial<Favorite[]>>;
}