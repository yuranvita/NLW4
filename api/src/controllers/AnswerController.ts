import { Request , Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysUserRepository } from '../repositories/SurveysUserRepository';
import { AppError } from '../errors/AppError';

class AnswerController {

    // http://localhost:3333/answers/1?u=surveys.id

    /**
     * Route Params => Parametros que compõe a rota
     * routes.get("/answers/:value")
     * 
     * Query Params => Busca, Paginação, não obrigatórios
     * ?
     * chave=valor
     */


    async execute ( request : Request , response : Response ){
        const { value } = request.params;
        const { u } = request.query;


        const surveysUserRepository = getCustomRepository(SurveysUserRepository);

        const surveyUser = await surveysUserRepository.findOne({
            id : String(u) 
        })

        if(!surveyUser) {
            throw new AppError("Survey User does not exists !");
            }
        

        surveyUser.value = Number(value);


        await surveysUserRepository.save(surveyUser);

        return response.status(200).json(surveyUser);


    }

}

export {AnswerController}