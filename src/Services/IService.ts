import { Response } from "express";

import { Favorite } from "../entity/Favorite";

export interface Film {
    id: number,
    title: string,
    releaseDate: Date,
}

export default interface IService {
    getFilms(): Promise<Film[]>;
    saveFavorite(name: string, moviesID: number[]): Promise<Partial<Favorite>>;
    getFavorites(page: number, search: string | null): Promise<[Favorite[], number]>;
    getFavorite(id: number): Promise<Favorite | null>;
    getExcel(id: number, response: Response): any;
}