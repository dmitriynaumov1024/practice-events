import { Model, type } from "better-obj"
import { pk, fk, max, belongsToOne } from "better-obj"

import { Person } from "./Person.js"
import { Event } from "./Event.js"

export class EventVisit extends Model 
{
    static get props () {
        return {
            personId: {
                type: type.Integer,
                rules: [ pk(), fk(Person) ]
            },
            eventId: {
                type: type.Integer,
                rules: [ pk(), fk(Event) ]
            },
            motivation: {
                type: type.String,
                rules: [ max(1000) ]
            },
            createdAt: {
                type: type.DateTime,
                rules: [ ]
            },
            isApproved: {
                type: type.Boolean,
                rules: [ ]
            },
            isVisited: {
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
