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
        let page: any = req.query.page;
        let search: string = String(req.query.search);
        if(page !== undefined) {
            page = Number(page);
        }

        if(page < 1 || page === undefined) {
            page = 1;
        }

        if(search === 'undefined'){
            search = '';
        }
        console.log(page);

        try{
            const favorites = await service.getFavorites(page, search);
            if(favorites === undefined) {
                throw new NotFoundError();
            }
            
            return res.status(200).json({'favorite': favorites[0], 'page': page, 'search': search, 'count': favorites[1]});
        }catch(err){
            console.log(err);
            throw new NotFoundError();
        }
    }
}

export function getFavorite(service: IService): ExpressRouteFunc {
    return async function(req: Request, res: Response) {
        const id: number = Number(req.params.id);
        console.log(id);
        try{
            const favorite = await service.getFavorite(id);
            if(favorite === undefined || favorite === null) {
                throw new NotFoundError();
            }
            
            return res.status(200).json({'favorite': favorite});
        }catch(err){
            throw new NotFoundError();
        }
    }
}