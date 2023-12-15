import { Random } from "./utils.js"

let notifyTimeouts = [ 
    60000, 600000, 3600000 
]

let notifyIntervals = [
    60000, 600000
]

async function seedEventNotification (db) {
    console.log("[i]: Seeding EventNotification")
    let visits = await db.eventVisit.query().withGraphJoined("event").limit(1000)
    let notifications = [ ]
    for (let visit of visits) {
        if (Random.probability(0.8)) {
            notifications.push({
                personId: visit.personId,
                eventId: visit.eventId,
                createadAt: visit.createadAt,
                notifyAt: new Date(visit.event.startsAt.valueOf() - Random.choice(notifyTimeouts)),
                interval: Random.choice(notifyIntervals),
                attempts: Random.integer(1, 3)
            })
        }
    }
    for (let notification of notifications) {
        await db.eventNotification.query().insert(notification)
    }
}

export {
    seedEventNotification
}
