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