// 
// relations
//

import { Model as ObjectionModel } from "objection"

function findFkColumn ({ source, target }) {
    let props = source.props
    for (let key in props) {
        let prop = props[key]
        let fkRule = prop.rules.filter(rule => rule.foreignKey)[0]
        if (fkRule && fkRule.target == target) {
            return key
        }
    }
}

function belongsToOne () {
    return {
        relation: ObjectionModel.BelongsToOneRelation,
        join ({ from, to }) {
            let source = from, target = to
            return {
                from: source.field(findFkColumn({ source, target })),
                to: target.field(target.idColumn[0])
            }
        }
    }
}

function hasOne () {
    return {
        relation: ObjectionModel.HasOneRelation,
        join ({ from, to }) {
            let source = from, target = to
            return {
                from: source.field(source.idColumn[0]),
                to: target.field(findFkColumn({ source: target, target: source }))
            }
        }
    }
}

function hasMany () {
    return {
        relation: ObjectionModel.HasManyRelation,
        join ({ from, to }) {
            let source = from, target = to
            return {
                from: source.field(source.idColumn[0]),
                to: target.field(findFkColumn({ source: target, target: source }))
            }
        }
    }
}

export {
    belongsToOne,
    hasOne,
    hasMany
}

