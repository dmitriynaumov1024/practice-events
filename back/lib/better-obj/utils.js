import crypto from "node:crypto"

async function paginate (page, size, queryFunc) {
    let items = await (queryFunc().offset((page-1)*size).limit(size+1))
    return {
        page: page,
        prev: (page > 1) ? page - 1 : null,
        next: (items.length > size) ? page + 1 : null,
        items: items
    }
}

function hash (source) {
    return crypto.createHash("blake2b512")
        .update(source)
        .digest("hex")
}

function randomHash (length) {
    return hash(crypto.randomBytes(length))
}

function offsetDate (...args) {
    if (args.length >= 2) {
        return new Date(args[0].valueOf() + args[1].valueOf())
    }
    else if (args.length == 1) {
        return new Date(new Date().valueOf() + args[0].valueOf())
    }
    else {
        return new Date()
    }
}

function ymdToDate (year, month, day) {
    year = String(year).padStart(4, "0")
    month = String(month).padStart(2, "0")
    day = String(day).padStart(2, "0")
    return new Date(`${year}-${month}-${day}T00:00:00`)
}

function inRange (number, min, max) {
    return number >= min && number <= max
}

function clamp (number, min, max) {
    if (number > max) return max
    else if (number < min) return min
    else return number
}

export {
    paginate,
    hash,
    randomHash,
    offsetDate,
    ymdToDate,
    inRange,
    clamp
}
