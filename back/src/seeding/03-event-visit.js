import { Random } from "./utils.js" 

async function seedEventVisit (db) {
    console.log("[i]: Seeding EventVisit")
    let events = await db.event.query().where("isPublic", true).limit(100)
    let persons = await db.person.query().limit(100)
    let visits = [ ]
    for (let event of events) {
        for (let person of persons) {
            if (Random.probability(0.5)) {
                let createdAt = event.createdAt.valueOf() + Random.integer(1000, 100000)
                visits.push({
                    personId: person.id,
                    eventId: event.id,
                    motivation: "",
                    createdAt: new Date(createdAt),
                    isApproved: true,
                    isVisited: false
                })
            }
        }
    }
    for (let visit of visits) {
        await db.eventVisit.query().insert(visit)
    }
}

export {
    seedEventVisit
}
