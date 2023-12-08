import { Model, type } from "better-obj"
import { pk, fk, cascade, max } from "better-obj"

import { Person } from "./Person.js"

export class PersonTag extends Model 
{
    static get props () {
        return {
            personId: {
                type: type.Integer,
                rules: [ pk(), fk(Person), cascade() ]
            },
            tag: {
                type: type.String,
                rules: [ pk(), max(30) ]
            }
        }
    }
}
