//
// Better models
//

import { type } from "./datatype.js"

import { Model as ObjectionModel } from "objection"

class Model extends ObjectionModel
{
    static get tableName () {
        return this.name
    }

    static field (name) {
        return this.tableName + "." + name
    }

    static get relationMappings () {
        this.ensurePropsParsed()
        return this._relations
    }

    static get idColumn () {
        this.ensureIdColumn()
        return this._idcolumn
    }

    static ensureIdColumn () {
        if (this._idcolumn) {
            return
        }

        let props = this.props
        if (! props) {
            throw Error("Model has no props declared")
        }

        let result = []

        for (let key in props) {
            let val = props[key]
            let primaryKey = val.type 
                && val.rules instanceof Array
                && val.rules.some(rule => rule.primaryKey)
            if (primaryKey) {
                result.push(key)
            } 
        }
        this._idcolumn = result
    }

    static ensurePropsParsed () {
        if (this._relations && this._idcolumn) {
            return
        }

        this._relations ??= { }
        this._fields ??= { }

        let props = this.props
        if (! props) {
            throw Error("Model has no props declared")
        }

        for (let key in props) {
            let val = props[key]
            val.rules ??= []
            // skip unsupported or malformed prop
            if (! val.type) {
                continue
            }
            // if prop is nested object then it goes to relation mappings
            if (Model.isPrototypeOf(val.type) || (val.type instanceof Array) && Model.isPrototypeOf(val.type[0])) {
                let plural = (val.type instanceof Array)
                let vtype = plural ? val.type[0] : val.type
                let rule = val.rules.filter(rule => rule.relation)[0]

                this._relations[key] = {
                    relation: rule.relation,
                    modelClass: vtype,
                    join: rule.join({ from: this, to: vtype })
                }
                continue
            }
            // if prop is a function that returns nested object and it goes to relation mappings
            if (val.type instanceof Function) {
                let vtype = val.type()
                vtype = (vtype instanceof Array)? vtype[0] : vtype
                let rule = val.rules.filter(rule => rule.relation)[0]

                this._relations[key] = {
                    relation: rule.relation,
                    modelClass: vtype,
                    join: rule.join({ from: this, to: vtype })
                }
                continue
            }
            // else it goes to field mappings
            if (true) {
                this._fields[key] = {
                    type: val.type,
                    rule: val.rules.reduce((a, b)=> Object.assign(a, b), { })
                }
                continue
            }
        }
    }

    static createTable (table) {
        if (this === Model) {
            throw Error("Model is abstract class, can not create table")
        }
        this.ensureIdColumn()
        this.ensurePropsParsed()

        for (let key in this._fields) {
            this.createColumn({ table, name: key, options: this._fields[key] })
        }

        table.primary(this._idcolumn)
    }

    static createColumn ({ table, name, options }) {
        let col = undefined
        // type
        if (options.type == type.Boolean) {
            col = table.boolean(name)
        }
        else if (options.type == type.String) {
            if (options.rule.max) col = table.string(name, options.rule.max)
            else col = table.text(name)
        }
        else if (options.type == type.Integer) {
            if (options.rule.increment) col = table.increments(name, options.rule)
            else col = table.integer(name)
        }
        else if (options.type == type.Float) {
            col = table.float(name)
        }
        else if (options.type == type.Double) {
            col = table.double(name)
        }
        else if (options.type == type.Date) {
            col = table.timestamp(name)
        }
        // extra rules
        if (options.rule.unique) {
            col = col.unique()
        }
        if (options.rule.foreignKey) {
            let target = options.rule.target
            col = col.references(target.field(target._idcolumn[0]))
        }
    }

    // define a model, e.g. create anonymous class
    static define (modelProps) {
        
        if (modelProps instanceof Function) modelProps = modelProps()

        return class extends Model {
            static get props() {
                return modelProps
            }
        }
    }

}

/*

Class * extends Model 
{
    required:
    + static get props(): {
        "name": {
            type: type/String | class extends Model | [ class extends Model ],
            rules: [ constraint.*()/Object ]
        }
    }

    example:
    static get Person.props() {
        return {
            id: {
                type: type.Integer,
                rules: [ pk(), increment() ]
            },
            email: {
                type: type.String,
                rules: [ unique(), max(60), regex("^[a-z0-9\.\-_]\@[a-z0-9\.][a-z0-9]$") ]
            },
            name: {
                type: type.String,
                rules: [ min(2), max(30) ]
            },
            createdAt: {
                type: type.Date
                rules: [ ]
            },
            tags: {
                type: [ PersonTag ],
                rules: [ hasMany() ]
            }
        }
    }

    static get Event.props() {
        return {
            id: {
                type: type.Integer,
                rules: [ pk(), increment() ]
            },
            title: {
                type: type.String,
                rules: [ max(60) ]
            },
            ownerId: {
                type: type.Integer,
                rules: [ fk(Person) ]
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

    static get EventTag.props() {
        return {
            eventId: {
                type: type.Integer,
                rules: [ pk(), fk(Event) ]
            },
            tag: {
                type: type.String,
                rules: [ pk(), max(40), regex("^[a-z0-9\-_]$") ]
            }
        }
    }

    optional:
    + static get tableName(): String
    
    inherit:
    + static createTable(table: TableBuilder): void
    + static get idColumn(): [ String ]
    + static get relationMappings(): Object
}

*/

export {
    Model
}
