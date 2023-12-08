import { Router } from "better-express"
import { paginate, hash } from "better-obj"

const pageSize = 10

async function view (request, response) {
    let { user, db, logger, query } = request
    let id = Number(query.id) || -1
    let person = await db.person.query()
        .withGraphJoined("tags")
        .where("id", id)
        .first()

    if (!person) {
        return response.status(404).json({
            success: false,
            notFound: true,
            message: "Not found"
        })
    }
    if (person.isPublic || person.id == user.id) {
        person.password = null
        return response.status(200).json({ 
            person: person, 
            success: true
        })
    }

    return response.status(200).json({
        person: {
            id: person.id,
            email: person.email
        },
        success: true,
        message: "Not public"
    })
    
}

async function list (request, response) {
    let { db } = request
    let page = Number(request.query.page) || 1

    let persons = db.person.query()
        .orderBy("id", "desc")

    let items = await paginate(page, pageSize, ()=> persons)
    items = items.map(item => {
        item.password = null
        if (item.isPublic) return item
        else return {
            id: item.id,
            email: item.email,
            createdAt: item.createdAt
        }
    })

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
        person.password = null
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

function diffTags (oldTags, newTags) {
    oldTags = new Set(oldTags.map(tag => tag.tag ?? tag))
    newTags = new Set(newTags.map(tag => tag.tag ?? tag))
    return {
        create: [...newTags].filter(tag => !oldTags.has(tag)),
        delete: [...oldTags].filter(tag => !newTags.has(tag))
    }
}

async function update (request, response) {
    let { user, db, logger } = request
    let id = Number(request.query.id)
    if (id != user.personId) {
        return response.status(401).json({
            unauthorized: true,
            success: false,
            message: "Unauthorized"
        })
    }

    let input = request.body.person
    input.tags = input.tags.map(item => ({
        personId: item.personId ?? id,
        tag: (item.tag ?? item).toLowerCase()
    }))

    let person = await db.person.query()
        .withGraphJoined("tags")
        .where("id", id)
        .first()
    
    let diff = diffTags(person.tags, input.tags)
    
    person.name = input.name
    person.isPublic = !!input.isPublic
    person.biography = input.biography || ""
    if (input.password) person.password = hash(input.password)
    person.tags = input.tags

    try {
        await db.person.query()
            .where("id", id)
            .update(person)
        await db.personTag.query().delete()
            .where("personId", person.id)
            .whereIn("tag", diff.delete)
        await db.personTag.query()
            .insertGraph(diff.create.map(tag => ({ personId: person.id, tag: tag })))
        person.password = null
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
