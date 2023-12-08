import { Router } from "better-express"
import { paginate, offsetDate } from "better-obj"

const pageSize = 10

async function view (request, response) {
    let { user, db, logger, query } = request
    let id = Number(query.id) 
    let event = await db.event.query()
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

let route = new Router()
route.get("/view", view)
route.get("/list", list)

export {
    route as event
}
