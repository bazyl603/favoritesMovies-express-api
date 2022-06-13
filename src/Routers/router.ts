import { Router } from 'express';

import { films } from '../Controllers/controller';
import IService from '../Services/IService';
import { Service } from '../Services/Service';

const router: Router = Router();
const service: IService = new Service();

router.get('/films', films(service));


export default router;