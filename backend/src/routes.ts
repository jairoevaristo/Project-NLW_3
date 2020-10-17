import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/uploads';
import OrgphanageController from './controllers/OrphanagesController';

const router = Router();
const uploads = multer(multerConfig);

router.get('/orphanages',OrgphanageController.index);
router.get('/orphanages/:id', OrgphanageController.show);
router.post('/orphanages', uploads.array('images'),OrgphanageController.create);

export default router;