import { Router } from "better-express"
import { paginate, hash } from "better-obj"

const pageSize = 10

async function view (request, response) {
    let { user, db, logger, query } = request
    let id = Number(query.id) || -1
    let person = await db.person.query()
        .where("id", id)
        .first()

    if (!person) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }
    if (!person.isPublic && person.id != user.id) {
        return response.status(404).json({
            success: false,
            unauthorized: true,
            message: "Not found"
        })
    }

    return response.status(200).json({ 
        person: person, 
        success: true, 
        message: "Not implemented yet" 
    })
}

async function list (request, response) {
    let { db } = request
    let page = Number(request.query.page) || 1

    let persons = db.person.query()
        .where("isPublic", true)
        .orderBy("id", "desc")

    let items = await paginate(page, pageSize, ()=> persons)

    return response.status(200).json(items)
}

async function create (request, response) {
    let { user, db, logger } = request
    let input = request.body.person
    let person = {
        name: input.name,
        email: input.email,
        isPublic: !!input.isPublic,
        biography: input.biography || "",
        password: hash(input.password),
        createdAt: new Date()
    }
    try {
        person = await db.person.query().insert(person)
        return response.status(200).json({
            person: person,
            success: true
        })
    }
    catch (error) {
        logger.error(error.stack)
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: Object.keys(person).filter(key => error.message.includes(key))
        })
    }
}

async function update (request, response) {
    let { user, db, logger } = request
    let id = Number(request.query.id)
    let input = request.body.person
    if (id != user.personId) {
        return response.status(401).json({
            unauthorized: true,
            success: false,
            message: "Unauthorized"
        })
    }

    let person = await db.person.query()
        .where("id", id)
        .first()

    person.name = input.name
    person.isPublic = !!input.isPublic
    person.biography = input.biography || ""
    person.password = hash(input.password)

    try {
        await db.person.query()
            .where("id", id)
            .update(person)
        return response.status(200).json({
            person: person,
            success: true
        })
    }
    catch (error) {
        logger.error(error.stack)
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: Object.keys(person).filter(key => error.message.includes(key))
        })
    }
}

let route = new Router()
route.get("/view", view)
route.get("/list", list)
route.post("/create", create)
route.post("/update", update)

export { 
    route as person 
}
