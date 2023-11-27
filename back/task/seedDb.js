import "dotenv/config"
import knex from "knex"
import { Knex, EventsDbAdapter } from "database"
import { EventsDbSeeder } from "seeding"

let connection = Knex.parseEnv()

let db = new EventsDbAdapter()
await db.connect(connection)

let seeder = new EventsDbSeeder()
await seeder.seed(db)

await db.disconnect()
