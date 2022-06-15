import { Router } from 'express';

import { films, saveFavorites, getFavorites, getFavorite, getExcel } from '../Controllers/controller';
import IService from '../Services/IService';
import { Service } from '../Services/Service';

const router: Router = Router();
const service: IService = new Service();

router.get('/films', films(service));
router.post('/favorites', saveFavorites(service));
router.get('/favorites', getFavorites(service));
router.get('/favorites/:id', getFavorite(service));
router.get('/favorites/:id/file', getExcel(service));



export default router;