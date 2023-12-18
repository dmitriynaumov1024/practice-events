// convert something like ["key1", "key2"] 
// to { "key1": true, "key2": true }
//
function arrayToDict (array) {
    let result = { }
    if (array.constructor == Array) 
        for (const key of array) result[key] = true
    return result 
}

// concatenate arrays
//
function arrayConcat (...arrays) {
    let result = [ ]
    for (const array of arrays) {
        for (const item of array) result.push(item)
    }
    return result
}

// Do content url resolution
//
function cdnResolve (url) {
    if (url?.startsWith && !url.startsWith("/")) url = "/" + url 
    return import.meta.env.VITE_CDN_BASEURL + "/files" + url
}

// Like Object.assign but nested
//
function nestedObjectAssign (target, patch) {
    if (patch instanceof Object) for (const key in patch) {
        let propValue = patch[key]
        if (propValue instanceof Function || propValue instanceof String || propValue instanceof Date || !(propValue instanceof Object)) {
            target[key] = propValue
        }
        else {
            if (!(target[key] instanceof Object)) target[key] = { }
            nestedObjectAssign(target[key], propValue)
        }
    }
    return target
}

// Create a deep copy of object
//
function nestedObjectCopy (source) {
    return nestedObjectAssign({ }, source)
}

// Merge object structure, with variable number of arguments.
// None of sources is modified, and the merged result is returned
// 
function nestedObjectMerge (...sources) {
    let result = { }
    for (const source of sources) {
        nestedObjectAssign(result, source)
    }
    return result
}

// Create a copy of object via JSON.stringify and JSON.parse
//
function jsonObjectCopy (source) {
    let stringified = JSON.stringify(source)
    return JSON.parse(stringified)
}

// Create FormData from array of files
//
function filesToFormData (files) {
    let result = new FormData()
    for (const item of files) {
        result.append("files", item)
    }
    return result
}

export { 
    arrayToDict,
    arrayConcat,
    cdnResolve,
    nestedObjectAssign,
    nestedObjectCopy,
    nestedObjectMerge,
    jsonObjectCopy,
    filesToFormData,
}
