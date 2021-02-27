import {Request , Response} from 'express'
import { getCustomRepository, RelationId } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysUserRepository } from '../repositories/SurveysUserRepository'
import SendMailService from '../services/SendMailService';
import {resolve} from 'path';

class SendMailController {

    async execute(request : Request , response : Response){

        const { email , surveys_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUserRepository = getCustomRepository(SurveysUserRepository);

        const user = await  usersRepository.findOne({email});

        if(!user){
            return response.status(400).json({
                error : "User does not exists"
            })
        }

        const survey = await surveysRepository.findOne({id: surveys_id})


        if(!survey) {
            return response.status(400).json({
                error : "Survey does not exists!"
            })
        }

        //salvando informação na tabela
        const surveyUserAlreadyExists = await surveysUserRepository.findOne({
            where : [{user_id : user.id} , {value : null}],
            relations : ["user" , "surveys"]
        });

        const variables = {
            name : user.name,
            title : survey.title,
            description : survey.description,
            user_id : user.id,
            link : process.env.URL_MAIL,
            
        };

        const npsPath = resolve(__dirname, ".." , "views" , "emails" , "npsMail.hbs");

        if(surveyUserAlreadyExists){
            await SendMailService.execute(email , survey.title , variables , npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUserRepository.create({
            user_id : user.id,
            surveys_id 
        })

       

        await surveysUserRepository.save(surveyUser);

        //enviar e-mail para o usuário.

       
        await SendMailService.execute(email , survey.title , variables , npsPath);



        return response.json(surveyUser);
        






    }
}

export {SendMailController};