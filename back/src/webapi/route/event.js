import { Router } from "better-express"
import { paginate, offsetDate } from "better-obj"

const pageSize = 10

async function view (request, response) {
    let { user, db, logger, query } = request
    let id = Number(query.id) 
    let event = await db.event.query()
        .withGraphJoined("tags")
        .where("id", id)
        .first()
    
    if (!event) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    } 
    let canSeeAll = event.isPublic || 
        event.ownerId == user.personId ||
        await db.eventVisit.query()
            .select("eventId")
            .where("eventId", id)
            .where("personId", user.personId)
            .where("isApproved", true)
            .first()

    if (canSeeAll) {
        return response.status(200).json({
            event: event,
            success: true
        })
    }
    else {
        event.location = null
        return response.status(200).json({
            event: event,
            success: true,
            message: "Not public"
        })
    }
}

async function list (request, response) {
    let { user, db, logger, query } = request
    let page = Number(query.page) || 1
    let tag = query.tag
    let ownerId = Number(query.owner) || 0
    let archive = query.archive == "true" || query.archive == "1"

    let events = db.event.query()
        .select("id", "ownerId", "title", "isPublic", "startsAt", "endsAt")
        
    if (tag) events = events.joinRelated("tags").where("tags.tag", tag)
    if (ownerId) events = events.where("ownerId", ownerId)
    if (archive) events = events.where("endsAt", "<", offsetDate(0))
    if (!archive) events = events.where("endsAt", ">=", offsetDate(0))

    let items = await paginate(page, pageSize, ()=> events.orderBy("startsAt"))

    return response.status(200).json(items)
}

async function create (request, response) {
    let { user, db, logger, query } = request
    let input = request.body.event
    if (!input || !(user.personId > 0)) {
        return response.status(400).json({
            success: false,
            badRequest: true
        })
    }
    let newEvent = {
        ownerId: user.personId,
        title: input.title,
        description: input.description,
        requirements: input.requirements,
        location: input.location,
        isPublic: input.isPublic,
        createdAt: new Date(),
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt)
    }
    try {
        newEvent = await db.event.query().insert(newEvent)
        newEvent.tags = input.tags.map(tag => ({
            tag: tag.tag ?? tag,
            eventId: newEvent.id
        }))

        await db.eventTag.query().insertGraph(newEvent.tags)

        return response.status(200).json({
            event: newEvent,
            success: true,
            message: "Successfully created event"
        })
    }
    catch (error) {
        logger.error(error)
        return response.status(400).json({
            success: false,
            badRequest: true,
            message: "Bad request"
        })
    }
}

function diffTags (oldTags, newTags) {
    oldTags = new Set(oldTags.map(tag => tag.tag ?? tag))
    newTags = new Set(newTags.map(tag => tag.tag ?? tag))
    return {
        create: [...newTags].filter(tag => !oldTags.has(tag)),
        delete: [...oldTags].filter(tag => !newTags.has(tag))
    }
}

async function update (request, response) {
    let { user, db, logger, query } = request
    if (!(user.personId > 0)) {
        return response.status(401).json({
            success: false,
            unauthorized: true,
            message: "Not authorized"
        })
    }
    let id = Number(request.query.id)
    let input = request.body.event
    if (!input) {
        return response.status(400).json({
            success: false,
            badRequest: true
        })
    }
    input.tags = input.tags.map(item => ({
        eventId: item.eventId ?? id,
        tag: (item.tag ?? item).toLowerCase()
    }))

    let event = await db.event.query()
        .withGraphJoined("tags")
        .where("id", id)
        .first()
    if (!event) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }
    if (event.ownerId != user.personId) {
        return response.status(401).json({
            success: false,
            unauthorized: true,
            message: "Not authorized"
        })
    }

    let diff = diffTags(event.tags, input.tags)
    event.title = input.title
    event.description = input.description
    event.requirements = input.requirements
    event.location = input.location
    event.isPublic = input.isPublic
    event.startsAt = new Date(input.startsAt)
    event.endsAt = new Date(input.endsAt)
    event.tags = input.tags

    try {
        await db.event.query()
            .where("id", event.id)
            .update(event)
        await db.eventTag.query().delete()
            .where("eventId", event.id)
            .whereIn("tag", diff.delete)
        await db.eventTag.query()
            .insertGraph(diff.create.map(tag => ({ eventId: event.id, tag: tag })))

        return response.status(200).json({
            event: event,
            success: true,
            message: "Successfully updated event"
        })
    }
    catch (error) {
        logger.error(error.stack)
        return response.status(400).json({
            success: false,
            badRequest: true,
            message: "Bad request"
        })
    }
}

async function remove (request, response) {
    let { user, db, logger, query } = request
    let deleted = await db.event.query().delete()
        .where("id", Number(query.id))
        .where("ownerId", user.personId)

    if (deleted) {
        return response.status(200).json({
            success: true,
            message: "Successfully deleted"
        })
    }
    else {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
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
    route as event
}
