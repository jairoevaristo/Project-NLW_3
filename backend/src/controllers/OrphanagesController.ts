import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as yup from 'yup';

import orphanageView from '../views/orphanages_view';
import Orphanage from '../models/Orphanage';

export default {
    async index(req: Request, res: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        })

        return res.json(orphanageView.renderMany(orphanages));
    },

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return res.json(orphanageView.render(orphanage));
    },

    async create(req: Request, res: Response) {
        const {
            name,
            longitude,
            latitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            telephone
        } = req.body;

        const orphanagesRepository = getRepository(Orphanage);

        const requestImages = req.files as Express.Multer.File[];

        const images = requestImages.map(images => {
            return { path: images.filename }
        })

        const data = {
            name,
            longitude,
            latitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images,
            telephone,
        };

        const schema = yup.object().shape({
            name: yup.string().required(),

            latitude: yup.number().required(),

            longitude: yup.number().required(),

            about: yup.string().required().max(300),

            instructions: yup.string().required(),

            opening_hours: yup.string().required(),

            open_on_weekends: yup.boolean().required(),

            images: yup.array(
                yup.object().shape({
                    path: yup.string().required()
            }))
        });

        await schema.validate(data, {
            abortEarly: false,
        })
        
        const orphanages = orphanagesRepository.create(data);

        await orphanagesRepository.save(orphanages);

        return res.status(201).json(orphanages);

    }
}