//
// get user session from request Authorization header
//
import qs from "qs"

const sessionTTL = 3600000
const sessionPasswordLength = 128

function isAlive(session) {
    // allow it to live for another sessionTTL/2 ms after it expired 
    return session.expiresAt && (new Date().valueOf() - session.expiresAt.valueOf() <= sessionTTL / 2)
}

function userSession({ fake } = { }) {
    return async function (request, response, next) {
        let { db, logger } = request
        let user = { personId: null }
        let authorization = qs.parse(request.headers["authorization"] ?? "")
        if (fake) {
            // thats really all fake authorization!
            user.personId = Number(authorization.personId) || 0
        }
        else {
            // logger.log(authorization)
            if (authorization.sessionId && authorization.password) {
                let storedAuth = await db.userSession.query()
                    .where("id", Number(authorization.sessionId))
                    .first()
                if (storedAuth && isAlive(storedAuth) && (storedAuth.password == authorization.password)) {
                    user.personId = storedAuth.personId
                    user.sessionId = storedAuth.id
                    user.password = storedAuth.password
                    user.expiresAt = storedAuth.expiresAt
                }
            }
            // logger.warn("Real authorization is not implemented yet")
        }
        request.user = user
        await next()
    }
}

export {
    userSession
}
