//
// Database adapter provider
//
function dbProvider (dbFactoryFunc) {
    return async function (request, response, next) {
        request.db = dbFactoryFunc()
        await next()
    }
}

export {
    dbProvider
}
