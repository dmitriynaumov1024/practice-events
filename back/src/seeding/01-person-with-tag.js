import { Random } from "./utils.js"
import { hash } from "better-obj"

let names = [
    "Alice", "Benjamin", "Charlotte", "Daniel", "Emma", "Finn", "Grace", 
    "Henry", "Isabella", "Jacob", "Katherine", "Liam", "Mia", "Noah", 
    "Olivia", "Penelope", "Quinn", "Ryan", "Sophia", "Theodore", "Uma", 
    "Victoria", "William", "Xander", "Yara", "Zane", "Ava", "Bryce",
    "Dylan", "Elena", "Felix", "Gabriella", "Hannah", "Isaac", "Julia", "Kai",
    "Lila", "Mason", "Nora", "Owen", "Paige", "Quincy", "Rose", "Samuel",
    "Tessa", "Ulysses", "Violet", "Xavier", "Yasmine", "Zara"
]

let tags = [
    "animals", "party", "literature", "coffee", "tea", "meeting", "offline",
    "online", "games", "children", "music",
]

let biographies = [
    "hello", "hi", "random", "biography", "content", "makes", "no", "sense", "excuse", "me", "from", "from"
]

let passwordChars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm.1234567890!@#$"

async function seedPersonWithTag (db) {
    let size = Random.integer(25, 32)
    let startDate = new Date("2023-11-30T09:01:23")
    console.log("[i]: Seeding Person")
    let persons = Array(size).fill(0).map(() => {
        startDate = new Date(startDate - 0 + Random.integer(500000, 12000000))
        let name = Random.choice(names),
            email = `${name.toLowerCase()}${Random.integer(444, 9999)}@mail.com`,
            biography = Random.array(3, 5, ()=> Random.choice(biographies)).join(" "),
            isPublic = Random.probability(0.8),
            password = Random.array(7, 19, ()=> Random.choice(passwordChars)).join(""),
            createdAt = startDate
        console.log(`[Person]  email=${email}  password=${password}`)
        password = hash(password)
        return {
            name, 
            email,
            biography,
            isPublic,
            password,
            createdAt
        }
    })
    for (let i in persons) {
        persons[i] = await db.person.query().insert(persons[i])
    }

    console.log("[i]: Seeding PersonTag")
    for (let i in persons) {
        persons[i].tags = [...new Set(Random.array(2, 3, ()=>Random.choice(tags)))].map(tag => ({
            personId: persons[i].id,
            tag: tag
        }))
        await db.personTag.query().insertGraph(persons[i].tags)
    }
}

export {
    seedPersonWithTag
}
