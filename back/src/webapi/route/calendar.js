import { Router } from "better-express"
import { raw } from "objection"
import { paginate } from "better-obj"
import { ymdToDate } from "better-obj"
import { Calendar } from "models"

const pageSize = 10

function inRange (value, min, max) {
    return value >= min && value <= max
}

async function monthSummary (request, response) {
    let { db, query } = request
    let year = Number(request.query.year)
    let month = Number(request.query.month)
    let tag = query.tag?.toLowerCase()
    if (!inRange(year, 2000, 9999) || !inRange(month, 1, 12)) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: [ "year", "month" ]
        })
    }
    let monthStart = Calendar.dayOf(ymdToDate(year, month, 1))
    let monthEnd = monthStart + 31

    let summary = db.event.query()

    if (tag) {
        summary = summary.select("calendarDay", raw("count(1)").as("count"))
                         .joinRelated("tags").where("tags.tag", tag)
    }
    else {
        summary = summary.select("calendarDay", raw("count(1)").as("count"))
    }

    summary = await summary.where("calendarDay", ">=", monthStart)
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
    let day = Calendar.dayOf(new Date(request.query.date))
    let tag = query.tag?.toLowerCase()
    let page = Number(query.page) || 1

    if (Number.isNaN(day)) {
        return response.status(400).json({
            success: false,
            badRequest: true,
            badFields: [ "date" ]
        })
    }
    
    let events = db.event.query().select("id", "title", "startsAt", "endsAt")
    if (tag) events = events.joinRelated("tags").where("tags.tag", tag)
    events = events.where("calendarDay", day).orderBy("startsAt")
    let items = await paginate(page, pageSize, ()=> events)
    
    return response.status(200).json(items)
}

let route = new Router()
route.get("/monthSummary", monthSummary)
route.get("/daySummary", daySummary)

export {
    route as calendar
}
