import { Random } from "./utils.js"

let tags = [
    "animals", "party", "literature", "coffee", "tea", "meeting", "offline",
    "online", "games", "children", "music",
]

let addresses = [
    "West st.", "Home st.", "Blue blvd.", "Theatre st.", "52nd st."
]

let websites = [
    "https://meet.example.com/", "https://chat.example.com/", "https://zoom.example.com/"
]

let alphabet = "abcdefghijklmnopqrstuvwxyz"

function day(date) {
    return (date.valueOf() / 86400000) | 0
}

async function seedEventWithTag (db) {
    console.log("[i]: Seeding Event")
    let persons = await db.person.query().orderBy("id").limit(100)
    let events = persons.map(person => Random.array(0, 3, ()=> {
        let createdAt = person.createdAt.valueOf() + Random.integer(10000, 1000000)
        let startAt = person.createdAt.valueOf() + Random.integer(1000000, 145678099)
        return {
            ownerId: person.id,
            calendarDay: day(startAt),
            title: "Example event",
            description: "Example event description",
            requirements: "Example event requirements",
            isPublic: Random.probability(0.7),
            location: Random.probability(0.5) ? 
                `${Random.choice(addresses)}, ${Random.integer(10, 99)}` :
                `${Random.choice(websites)}${Random.array(10, 16, ()=> Random.choice(alphabet)).join("")}`,
            createdAt: new Date(createdAt),
            startsAt: new Date(startAt),
            endsAt: new Date(startAt + Random.integer(2, 9) * 1800000) 
        }
    })).flat()

    for (let i in events) {
        events[i] = await db.event.query().insert(events[i])
    }

    console.log("[i]: Seeding EventTag")
    for (let i in events) {
        events[i].tags = [...new Set(Random.array(2, 3, ()=>Random.choice(tags)))].map(tag => ({
            eventId: events[i].id,
            tag: tag
        }))
        await db.eventTag.query().insertGraph(events[i].tags)
    }
}

export {
    seedEventWithTag
}
