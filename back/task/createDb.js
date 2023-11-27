import "dotenv/config"
import knex from "knex"
import { Knex, EventsDbAdapter } from "database"

let connection = Knex.parseEnv()

let db = await new EventsDbAdapter().connect(connection)

await db.createDb({ reset: process.env.ENVIRONMENT_TYPE == "development" })
await db.disconnect()
