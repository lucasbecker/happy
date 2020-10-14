import { Request, Response } from 'express'
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';

export default {
  // LISTAR ORFANATOS
  async index(request: Request, response: Response){
    // Criando um repositório de orfanatos 
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    }); 
    // para fazer alguma condição na listagem basta utilizar os "métodos" do find() 

    return response.json(orphanageView.renderMany(orphanages));
  },

  // MOSTRAR UM ORFANATO
  async show(request: Request, response: Response){
    // Capturando o id do orfanato da requisição
    const { id } = request.params;

    // Criando um repositório de orfanatos 
    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    }); 
    // para fazer alguma condição na listagem basta utilizar os "métodos" do find() 

    return response.json(orphanageView.render(orphanage));
  },

  // CADASTRAR ORFANATO
  async create(request: Request, response: Response){
    //desestruturando o body da requisição
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body;

    // Criando um repositório de orfanatos 
    const orphanagesRepository = getRepository(Orphanage);

    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map(image => {
      return { path: image.filename };
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    };
    // Esquema de validação dos dados
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    // Validando os dados
    await schema.validate(data, {
      abortEarly: false
    });

    // Criando orfanato
    const orphanage = orphanagesRepository.create(data);

    // Salvando no banco de dados
    await orphanagesRepository.save(orphanage);

    /* a operação .save é assíncrona, por tanto para executarmos o restante do código abaixo corretamente devemos utilizar o await acima e por consequência tornar toda a função async */
    return response.status(201).json(orphanage);
  }
};