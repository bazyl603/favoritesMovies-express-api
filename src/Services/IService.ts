export interface Film {
    id: number,
    title: string,
    releaseDate: Date,
}

export default interface IService {
    getFilms(): Promise<Film[]>;
}