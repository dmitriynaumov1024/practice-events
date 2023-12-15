import "dotenv/config"
import knex from "knex"
import { Knex, EventsDbAdapter } from "database"

let connection = Knex.parseEnv()

let db = await new EventsDbAdapter().connect(connection)

await db.dropDb()
await db.disconnect()
