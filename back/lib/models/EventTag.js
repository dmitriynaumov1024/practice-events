import { Model, type } from "better-obj"
import { pk, fk, max } from "better-obj"

import { Event } from "./Event.js"

export class EventTag extends Model 
{
    static get props () {
        return {
            eventId: {
                type: type.Integer,
                rules: [ pk(), fk(Event) ]
            },
            tag: {
                type: type.String,
                rules: [ pk(), max(30) ]
            }
        }
    }
}
