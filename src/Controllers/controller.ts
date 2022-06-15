import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../error/NotFoundError";
import IService from "../Services/IService";

type ExpressRouteFunc = (req: Request, res: Response, next?: NextFunction) => void | Promise<Response>;

export function films(service: IService): ExpressRouteFunc {
    return async function(req: Request, res: Response) {
        try{
            const films = await service.getFilms();
            return res.status(200).json({'films': films});
        }catch(err){
            throw new NotFoundError();
        }
    }
}

export function saveFavorites(service: IService): ExpressRouteFunc {
    return async function(req: Request, res: Response) {
        const {name, movie} = req.body;
        try{
            const favorite = await service.saveFavorite(name, movie);
            return res.status(200).json({'favorite': favorite});
        }catch(err){
            throw new NotFoundError();
        }
    }
}

export function getFavorites(service: IService): ExpressRouteFunc {
    return async function(req: Request, res: Response) {
        try{
            const favorite = await service.getFavorites();
            if(favorite === undefined) {
                throw new NotFoundError();
            }

            const fav = favorite.map(f => {
                return {
                    id: f!.id,
                    name: f!.name
                }
            });
            
            return res.status(200).json({'favorite': fav});
        }catch(err){
            throw new NotFoundError();
        }
    }
}