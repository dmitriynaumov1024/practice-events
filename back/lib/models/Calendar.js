import { Model, type } from "better-obj"
import { pk, hasMany } from "better-obj"

import { Event } from "./Event.js"

export class Calendar extends Model 
{
    static get props () {
        return {
            day: {
                type: type.Integer,
                rules: [ pk() ]
            },
            events: {
                type: [ Event ],
                rules: [ hasMany() ]
            }
        }
    }

    static today () {
        return this.dayOf(new Date()) 
    }

    static dayOf (date) {
        return Math.floor(date.valueOf() / 86400000)
    }
}
