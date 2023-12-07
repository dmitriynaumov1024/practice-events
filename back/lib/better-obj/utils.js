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

export {
    paginate,
    hash,
    randomHash,
    offsetDate
}