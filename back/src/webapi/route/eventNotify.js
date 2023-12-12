import { Router } from "better-express"
import { paginate, clamp } from "better-obj"

const pageSize = 10

async function view (request, response) {
    let { db, logger, user, query } = request
    let eventId = Number(query.event) || 0
    let personId = Number(query.person) || 0
    
    if (personId != user.personId) {
        return response.status(401).json({
            success: false,
            unauthorized: true,
            message: "Not authorized"
        })
    }

    let notification = await db.eventNotification.query()
        .withGraphJoined("event")
        .where("eventId", eventId)
        .where("personId", personId)
        .first()

    if (!notification) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }

    notification.event = {
        id: notification.event.id,
        title: notification.event.title,
        startsAt: notification.event.startsAt,
        endsAt: notification.event.endsAt
    }

    return response.status(200).json({
        eventNotification: notification,
        success: true
    })
}

async function list (request, response) {
    let { db, logger, user, query } = request
    let personId = Number(query.person) || 0
    let page = Number(query.page) || 1
    let archive = query.archive == "true"

    if (personId != user.personId) {
        return response.status(401).json({
            success: false,
            unauthorized: true,
            message: "Not authorized"
        })
    }

    let notifications = db.eventNotification.query()
        .withGraphJoined("event")
        .where("personId", personId)
    
    if (archive) notifications = notifications.where("event.endsAt", "<", new Date())
    if (!archive) notifications = notifications.where("event.endsAt", ">=", new Date())

    let items = await paginate(page, pageSize, ()=> notifications)

    for (let notification of items.items) {
        notification.event = {
            id: notification.event.id,
            title: notification.event.title,
            startsAt: notification.event.startsAt,
            endsAt: notification.event.endsAt
        }
    }

    return response.status(200).json(items)
}

async function create (request, response) {
    let { db, logger, user, body } = request
    let input = body.eventNotification
    
    if (!input || !input.eventId || !input.personId) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            message: "Bad request"
        })
    }

    if (!user.personId || (input.personId != user.personId)) {
        return response.status(401).json({
            success: false,
            unauthorized: true,
            message: "Not authorized"
        })
    }

    let event = await db.event.query()
        .select("id", "title", "startsAt", "endsAt")
        .where("id", input.eventId).first()
    if (!event) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Event not found"
        })
    }

    try {
        let notification = await db.eventNotification.query().insert({
            eventId: input.eventId,
            personId: input.personId,
            createdAt: new Date(),
            notifyAt: clamp(new Date(input.notifyAt), new Date(), event.endsAt),
            attempts: clamp(input.attempts, 1, 99),
            interval: clamp(input.interval, 60000, 86400000),
            isSuccess: false
        })
        notification.event = event
        return response.status(200).json({
            eventNotification: notification,
            success: true,
            message: "Successfully created"
        })
    }
    catch (error) {
        logger.error(error.stack)
        return response.status(500).json({
            success: false,
            serverError: true
        })
    }
}

async function update (request, response) {
    let { db, logger, user, body } = request
    let input = body.eventNotification
    
    if (!input || !input.eventId || !input.personId) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            message: "Bad request"
        })
    }

    if (!user.personId || (input.personId != user.personId)) {
        return response.status(401).json({
            success: false,
            unauthorized: true,
            message: "Not authorized"
        })
    }

    let notification = await db.eventNotification.query()
        .withGraphJoined("event")
        .where("eventId", input.eventId)
        .where("personId", input.personId)
        .first()

    if (!notification) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }

    notification.notifyAt = clamp(new Date(input.notifyAt), new Date(), notification.event.endsAt)
    notification.attempts = clamp(input.attempts, 1, 99)
    notification.interval = clamp(input.interval, 60000, 86400000)

    notification.event = {
        id: notification.event.id,
        title: notification.event.title,
        startsAt: notification.event.startsAt,
        endsAt: notification.event.endsAt
    }

    try {
        await db.eventNotification.query()
            .where("eventId", input.eventId)
            .where("personId", input.personId)
            .update(notification)

        return response.status(200).json({
            eventNotification: notification,
            success: true,
            message: "Successfully updated"
        })
    }
    catch (error) {
        logger.error(error.stack)
        return response.status(500).json({
            success: false,
            serverError: true
        })
    }
}

async function remove (request, response) {
    let { db, logger, user, query } = request
    let eventId = Number(query.event) || 0
    let personId = Number(query.person) || 0
    
    if (!eventId || !personId) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: [ "event", "person" ]
        })
    }
    if (personId != user.personId) {
        return response.status(401).json({
            success: false,
            unauthorized: true
        })
    }

    let notification = await db.eventNotification.query()
        .where("eventId", eventId)
        .where("personId", personId)
        .first()

    if (!notification) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }

    try {
        await db.eventNotification.query()
            .delete()
            .where("eventId", eventId)
            .where("personId", personId)
        
        return response.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    }
    catch (error) {
        return response.status(500).json({
            success: false,
            serverError: true,
            message: "Can not delete"
        })
    }
}

let route = new Router()
route.get("/view", view)
route.get("/list", list)
route.post("/create", create)
route.post("/update", update)
route.delete("/delete", remove)

export {
    route as eventNotify
}
