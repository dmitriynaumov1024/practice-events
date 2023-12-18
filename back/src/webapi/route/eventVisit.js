import { Router } from "better-express"
import { paginate } from "better-obj"

const pageSize = 10

async function view (request, response) {
    let { db, logger, user, query } = request
    let eventId = Number(query.event) || 0
    let personId = Number(query.person) || 0
    
    let eventVisit = await db.eventVisit.query()
        .withGraphJoined("[event, person]")
        .where("eventId", eventId)
        .where("personId", personId)
        .first()

    if (!eventVisit) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }

    eventVisit.person = {
        id: eventVisit.person.id,
        email: eventVisit.person.email,
        name: eventVisit.person.name,
        isPublic: eventVisit.person.isPublic
    }

    eventVisit.event = {
        id: eventVisit.event.id,
        ownerId: eventVisit.event.ownerId,
        title: eventVisit.event.title,
        startsAt: eventVisit.event.startsAt,
        endsAt: eventVisit.event.endsAt,
        isPublic: eventVisit.event.isPublic,
        location: (eventVisit.isApproved || eventVisit.event.ownerId == personId)? eventVisit.event.location : null
    }

    let canSee = eventVisit.personId == personId || 
                 eventVisit.event.ownerId == personId ||
                 eventVisit.person.isPublic

    if (canSee) {
        return response.status(200).json({
            eventVisit: eventVisit,
            success: true
        })
    }
    else {
        return response.status(401).json({
            success: false,
            unauthorized: true
        })
    }
}

async function list (request, response) {
    let { db, logger, user, query } = request
    let page = Number(query.page) || 1
    let eventId = Number(query.event) || 0
    let personId = Number(query.person) || 0
    let approved = query.approved? (query.approved == "true") : null
    let archive = query.archive == "true"
    
    if (eventId && personId) {
        return view(request, response)
    }
    if (!eventId && !personId) {
        return response.status(400).json({
            success: false,
            badRequest: true
        })
    }

    let visits = db.eventVisit.query()
        .withGraphJoined("[event, person]")

    if (eventId) visits = visits.where("eventId", eventId).where("event.ownerId", user.personId)
    if (personId) visits = visits.where("personId", personId)
    if (personId && (user.personId != personId)) visits = visits.where("person.isPublic", true)
    if (approved != null) visits = visits.where("isApproved", approved)
    if (archive) visits = visits.where("event.endsAt", "<", new Date())
    if (!archive) visits = visits.where("event.endsAt", ">=", new Date())

    let items = await paginate(page, pageSize, ()=> visits)
    for (let item of items.items) {
        item.event = {
            id: item.event.id,
            title: item.event.title,
            isPublic: item.event.isPublic,
            startsAt: item.event.startsAt,
            endsAt: item.event.endsAt
        }
        item.person = {
            id: item.person.id,
            name: item.person.name,
            email: item.person.email,
            isPublic: item.person.isPublic
        }
    }
    return response.status(200).json(items)
}

async function create (request, response) {
    let { db, logger, user, body } = request
    let input = body.eventVisit
    
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
        .where("id", input.eventId).first()
    if (!event) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Event not found"
        })
    }

    try {
        let visit = await db.eventVisit.query().insert({
            eventId: input.eventId,
            personId: input.personId,
            createdAt: new Date(),
            isApproved: false,
            isVisited: false,
            motivation: input.motivation
        })
        visit.event = event
        return response.status(200).json({
            eventVisit: visit,
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
    let { db, logger, user, body} = request
    let input = body.eventVisit

    if (!input || !input.eventId || !input.personId) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            message: "Bad request"
        })
    }

    let eventVisit = await db.eventVisit.query()
        .withGraphJoined("event")
        .where("eventId", input.eventId)
        .where("personId", input.personId)
        .first()

    if (!eventVisit) {
        return response.status(404).json({
            success: false,
            notFound: true
        })
    }

    let isVisitor = input.personId == user.personId
    let isOwner = eventVisit.event.ownerId == user.personId
    
    if (isVisitor) {
        eventVisit.motivation = input.motivation || ""
        if (input.isVisited != null) eventVisit.isVisited = input.isVisited
    }
    if (isOwner) {
        if (input.isApproved != null) eventVisit.isApproved = input.isApproved
        if (input.isVisited != null) eventVisit.isVisited = input.isVisited
    }
    if (!isVisitor && !isOwner) {
        return response.status(401).json({
            success: false,
            unauthorized: true
        })
    }

    try {
        await db.eventVisit.query()
            .where("eventId", input.eventId)
            .where("personId", input.personId)
            .update(eventVisit)

        return response.status(200).json({
            success: true,
            eventVisit: eventVisit,
            message: "Successfully updated"
        })
    }
    catch (error) {
        logger.error(error.stack)
        return response.status(500).json({
            success: false,
            serverError: true,
            message: "Can not update"
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

    let visit = await db.eventVisit.query()
        .where("eventId", eventId)
        .where("personId", personId)
        .first()

    if (!visit) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }

    try {
        await db.eventVisit.query()
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
    route as eventVisit
}
