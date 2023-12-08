import { Model, type } from "better-obj"
import { pk, fk, cascade, min, belongsToOne } from "better-obj"

import { Person } from "./Person.js"
import { Event } from "./Event.js"

export class EventNotification extends Model 
{
    static get props () {
        return {
            personId: {
                type: type.Integer,
                rules: [ pk(), fk(Person), cascade() ]
            },
            eventId: {
                type: type.Integer,
                rules: [ pk(), fk(Event), cascade() ]
            },
            createdAt: {
                type: type.DateTime,
                rules: [ ]
            },
            notifyAt: {
                type: type.DateTime,
                rules: [ ]
            },
            attempts: {
                type: type.Integer,
                rules: [ min(0) ]
            },
            interval: {
                type: type.Integer,
                rules: [ min(0) ]
            },
            isSuccess: {
                type: type.Boolean,
                rules: [ ]
            },
            person: {
                type: Person,
                rules: [ belongsToOne() ]
            },
            event: {
                type: Event,
                rules: [ belongsToOne() ]
            }
        }
    }
}
