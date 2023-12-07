//
// error catcher
//
function errorCatcher (loggerFactoryFunc) {
    return async function (error, request, response, next) {
        let logger = (loggerFactoryFunc instanceof Function)? loggerFactoryFunc() : null
        if (logger) logger.error("Something went wrong:\n    "+error.stack) 
        return response.status(400).json({
            success: false,
            serverError: true
        })
    }
}

export {
    errorCatcher
}
