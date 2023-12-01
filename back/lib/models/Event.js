import { Model, type } from "better-obj"
import { pk, fk, increment, unique, max, belongsToOne, hasMany } from "better-obj"

import { Calendar } from "./Calendar.js"
import { Person } from "./Person.js"
import { EventTag } from "./EventTag.js"

export class Event extends Model 
{
    static get props () {
        return {
            id: {
                type: type.Integer,
                rules: [ pk(), increment() ]
            },
            ownerId: {
                type: type.Integer,
                rules: [ fk(Person) ]
            },
            calendarDay: {
                type: type.Integer,
                rules: [ fk(Calendar) ]
            },
            title: {
                type: type.String,
                rules: [ max(80) ]
            },
            description: {
                type: type.String,
                rules: [ max(8000) ]
            },
            requirements: {
                type: type.String,
                rules: [ max(2000) ]
            },
            location: {
                type: type.String,
                rules: [ max(400) ]
            },
            isPublic: {
                type: type.Boolean,
                rules: [ ]
            },
            createdAt: {
                type: type.DateTime,
                rules: [ ]
            },
            startsAt: {
                type: type.DateTime,
                rules: [ ]
            },
            endsAt: {
                type: type.DateTime,
                rules: [ ]
            },
            owner: {
                type: Person,
                rules: [ belongsToOne() ]
            },
            tags: {
                type: [ EventTag ],
                rules: [ hasMany() ]
            }
        }
    }
    
}
