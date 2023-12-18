//
// logger provider
//
function loggerProvider (loggerFactoryFunc) {
    return async function (request, response, next) {
        request.logger = loggerFactoryFunc()
        await next()
    }
}

export {
    loggerProvider
}
