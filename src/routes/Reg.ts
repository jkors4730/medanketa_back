import { Router } from 'express';
import { regController } from '../controllers/Reg';

const regRoutes = Router();

// (R) GET_ALL (REGIONS)
regRoutes.get('/regions',
    regController.getRegions
);

// (R) GET_ALL (CITIES)
regRoutes.get('/cities',
    regController.getCities
);

// (R) GET_ALL (CITIES)
regRoutes.get('/spec',
    regController.getSpec
);

export default regRoutes
