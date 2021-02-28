import {Request , Response}  from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUserRepository } from '../repositories/SurveysUserRepository';

class NpsController {

    /**
     * Nota : 1 a 10
     * Detratores => 0 a 6
     * Passivos => 7 e 8
     * Promissores => 9 e 10 
     * 
     *  Calculo NPS:
     * ( Número de promotores - Número de Detratores) / Número de respondentes x 100
     */

    async execute(request : Request , response : Response){

        const { surveys_id } = request.params;

        const surveysUserRepository = getCustomRepository(SurveysUserRepository);

        const surveysUsers = await surveysUserRepository.find({
            surveys_id,
            value: Not(IsNull())
        });

        
        const detractor = surveysUsers.filter( 
            (surveys) => surveys.value >= 0 && surveys.value <=6
        ).length;

        const promoters = surveysUsers.filter(
            (surveys) =>  surveys.value >= 9 && surveys.value <=10
        ).length;

        const passive = surveysUsers.filter(
            (surveys)  =>  surveys.value >= 7 && surveys.value <= 8
       ).length;

        const totalAnswers = surveysUsers.length;

        const calculate =  Number((((promoters - detractor) / totalAnswers) * 100).toFixed(2));
        
    

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps:calculate
        });



    }


}


export {NpsController}