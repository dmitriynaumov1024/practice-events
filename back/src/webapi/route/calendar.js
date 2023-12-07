import { Router } from "better-express"
import { raw } from "objection"
import { paginate } from "better-obj"

const pageSize = 10

function inRange (value, min, max) {
    return value >= min && value <= max
}

async function monthSummary (request, response) {
    let { db, query } = request
    let year = Number(request.query.year)
    let month = Number(request.query.month)
    if (!inRange(year, 2000, 9999) || !inRange(month, 1, 12)) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: [ "year", "month" ]
        })
    }
    let monthStart = new Date(`${year}-${month}-01`).valueOf() / 86400000
    let monthEnd = monthStart + 31
    let summary = await db.event.query()
        .select("calendarDay", raw("count(1)").as("count"))
        .where("calendarDay", ">=", monthStart)
        .where("calendarDay", "<", monthEnd)
        .groupBy("calendarDay")
        .orderBy("calendarDay")

    summary = summary.map(item => ({
        date: new Date(item.calendarDay * 86400000),
        calendarDay: item.calendarDay,
        count: item.count
    })).filter(item => item.date.getMonth()+1 == month)

    return response.status(200).json({
        items: summary,
        success: true
    })
}

async function daySummary (request, response) {
    let { db, query } = request
    let day = new Date(query.date).valueOf() / 86400000
    if (Number.isNaN(day)) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: [ "date" ]
        })
    }
    let tag = query.tag || "all"
    let page = Number(query.page) || 1
    let events = db.event.query()
        .withGraphJoined("tags")
        .where("calendarDay", day)
        .orderBy("startsAt")

    let items = await paginate(page, pageSize, ()=> events)

    response.status(200).json(items)
}

let route = new Router()
route.get("/monthSummary", monthSummary)
route.get("/daySummary", daySummary)

export {
    route as calendar
}
