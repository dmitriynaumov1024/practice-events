import { Model, type } from "better-obj"
import { pk, increment, unique, max, hasMany } from "better-obj"

import { PersonTag } from "./PersonTag.js"

export class Person extends Model
{
    static get props () {
        return {
            id: {
                type: type.Integer,
                rules: [ pk(), increment() ]
            },
            email: {
                type: type.String,
                rules: [ unique(), max(60) ]
            },
            name: {
                type: type.String,
                rules: [ max(40) ]
            }, 
            biography: {
                type: type.String,
                rules: [ max(160) ]
            },
            isPublic: {
                type: type.Boolean,
                rules: [ ]
            },
            password: {
                type: type.String,
                rules: [ max(256) ]
            },
            createdAt: {
                type: type.DateTime,
                rules: [ ]
            },
            tags: {
                type: [ PersonTag ],
                rules: [ hasMany() ]
            }
        }
    }
}
