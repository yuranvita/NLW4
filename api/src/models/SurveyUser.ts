import { Entity, JoinColumn, ManyToOne } from "typeorm";

import { Column, CreateDateColumn, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { User } from "./User";
import { Surveys } from "./Surveys";


@Entity("surveys_users")
class SurveyUser{
    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: string;

    @ManyToOne(()=> User)
    @JoinColumn({name:"user_id"})
    user: User

    @Column()
    surveys_id: string;

    @ManyToOne(()=> Surveys)
    @JoinColumn({name:"surveys_id"})
    surveys: Surveys

    @Column()
    value : number;

    @CreateDateColumn()
    created_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export { SurveyUser }