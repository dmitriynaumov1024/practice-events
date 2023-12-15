import { Router } from "better-express"
import { raw } from "objection"
import { paginate } from "better-obj"

const pageSize = 10

async function list (request, response) {
    let { db, query } = request
    let page = Number(query.page) || 1

    let tags = db.eventTag.query()
        .select("tag", raw("count(1)").as("count"))
        .groupBy("tag")
        .orderBy("count", "desc")

    let tagCount = await paginate(page, pageSize, ()=> tags)

    response.status(200).json(tagCount)
}

let route = new Router()
route.get("/list", list)

export {
    route as tag
}
