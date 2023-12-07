import { Router } from "better-express"
import { hash, randomHash, offsetDate } from "better-obj"

const sessionTTL = 3600000
const sessionPasswordLength = 128

function isAlive(session) {
    // allow it to live for another sessionTTL/2 ms after it expired 
    return session.expiresAt && (new Date().valueOf() - session.expiresAt.valueOf() <= sessionTTL / 2)
}

async function login (request, response) {
    let { db, logger, user } = request
    if (user.sessionId) {
        return response.status(400).json({
            success: false,
            message: "Already logged in"
        })
    }
    let person = await db.person.query()
        .where("email", request.body.email)
        .first()
    if (person?.password == hash(request.body.password)) {
        let session = await db.userSession.query().insert({
            personId: person.id,
            password: randomHash(sessionPasswordLength),
            expiresAt: offsetDate(sessionTTL)
        })
        return response.status(200).json({
            person: {
                id: session.personId,
            },
            session: {
                sessionId: session.id,
                password: session.password,
                expiresAt: session.expiresAt
            },
            success: true,
            message: "Successfully logged in"
        })
    }
    else if (!person) {
        return response.status(404).json({
            success: false,
            notFound: true,
            badFields: [ "email" ]
        })
    }
    else {
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: [ "password" ]
        })
    }
}

async function refresh (request, response) {
    let { db, logger, user } = request
    let session = user
    if (isAlive(session) && session.personId) {
        session.password = randomHash(sessionPasswordLength)
        session.expiresAt = offsetDate(sessionTTL)
        await db.userSession.query()
            .where("id", session.sessionId)
            .patch({ password: session.password, expiresAt: session.expiresAt })
        return response.status(200).json({
            session: {
                sessionId: session.sessionId,
                password: session.password,
                expiresAt: session.expiresAt
            },
            success: true,
            message: "Successfully refreshed"
        })
    }
    else {
        return response.status(401).json({
            unauthorized: true,
            success: false,
            message: "Unauthorized"
        })
    }

}

async function logout (request, response) {
    let { db, logger, user } = request
    let deleted = await db.userSession.query().delete()
        .where("id", user.sessionId)
        .where("password", user.password)

    if (deleted) {
        return response.status(200).json({
            success: true,
            message: "Successfully logged out"
        })
    }
    else {
        return response.status(401).json({
            unauthorized: true,
            success: false,
            message: "Unauthorized"
        })
    }
}

let route = new Router()
route.post("/login", login)
route.post("/refresh", refresh)
route.post("/logout", logout)

export {
    route as auth
}
