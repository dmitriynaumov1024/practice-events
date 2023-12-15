//
// allow CORS requests from given base URL
//
function crossOrigin ({ origins, headers="*" }) {
    return async function (request, response, next) {
        response.append("Access-Control-Allow-Origin", origins)
        response.append("Access-Control-Allow-Headers", headers)
        await next()
    }
}

export {
    crossOrigin
}
