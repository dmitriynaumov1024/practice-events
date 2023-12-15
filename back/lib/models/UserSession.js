import { Model, type } from "better-obj"
import { pk, fk, cascade, increment, unique, max } from "better-obj"
import { randomHash } from "better-obj"

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
                rules: [ fk(Person), cascade() ]
            },
            password: {
                type: type.String,
                rules: [ max(256) ]
            },
            expiresAt: {
                type: type.DateTime,
                rules: [ ]
            }
        }
    }

    static get TTL () {
        return 3600000
    }

    static get passwordLength () {
        return 128
    }

    static randomPassword () {
        return randomHash(UserSession.passwordLength)
    }

    get isAlive () {
        return this.expiresAt && (new Date().valueOf() - this.expiresAt.valueOf() <= UserSession.TTL / 2)
    }
}
