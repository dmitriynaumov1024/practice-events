//
// Constraints
// 

function pk () {
    return {
        primaryKey: true
    }
}

function fk (model) {
    // if model is lambda function
    if ((model instanceof Function) && !model.prototype) {
        model = model()
    }
    return {
        foreignKey: true,
        target: model
    }
}

function increment () {
    return {
        increment: true
    }
}

function unique () {
    return {
        unique: true
    }
}

function min (value) {
    return {
        min: value
    }
}

function max (value) {
    return {
        max: value
    }
}

function regex (pattern) {
    return {
        regex: pattern
    }
}

const constraint = {
    pk, fk, increment, unique, min, max, regex
}

export {
    constraint,
    pk, fk, increment, unique, min, max, regex
}

