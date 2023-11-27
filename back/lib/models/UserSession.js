import { Model, type } from "better-obj"
import { pk, fk, increment, unique, max } from "better-obj"

import { Person } from "./Person.js"

export class UserSession extends Model 
{
    static get props () {
        return {
            id: {
                type: type.Integer,
                rules: [ pk(), increment() ]
            },
            personId: {
                type: type.Integer,
                rules: [ fk(Person) ]
            },
            password: {
                type: type.String,
                rules: [ max(160) ]
            },
            expiresAt: {
                type: type.DateTime,
                rules: [ ]
            }
        }
    }
}
