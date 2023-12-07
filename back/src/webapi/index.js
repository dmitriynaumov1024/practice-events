import "dotenv/config"
import { Application } from "better-express"
import { ConsoleLogger } from "logging"
import { EventsDbAdapter, Knex } from "database"
import { errorCatcher } from "./middleware/error-catcher.js"
import { loggerProvider } from "./middleware/logger-provider.js"
import { dbProvider } from "./middleware/db-provider.js"
import { requestLogger } from "./middleware/request-logger.js"
import { userSession } from "./middleware/user-session.js"
import { jsonBodyParser } from "./middleware/json-parser.js"
import { crossOrigin } from "./middleware/cross-origin.js"

// routes
import { auth } from "./route/auth.js"
import { person } from "./route/person.js"
import { event } from "./route/event.js"
import { eventVisit } from "./route/eventVisit.js"
import { eventNotify } from "./route/eventNotify.js"
import { calendar } from "./route/calendar.js"
import { tag } from "./route/tag.js"

// create base services
let logger = new ConsoleLogger()
let dbAdapter = new EventsDbAdapter()
await dbAdapter.connect(Knex.parseEnv())

// create application
let application = new Application()

// provide base services
application.use(loggerProvider(()=> logger))
application.use(dbProvider(()=> dbAdapter))

// use middlewares
application.use(requestLogger())
application.use(userSession())
application.use(jsonBodyParser())
application.use(crossOrigin({ origins: "*" }))

// use endpoints
application.use("/auth", auth)
application.use("/person", person)
application.use("/event", event)
application.use("/eventVisit", eventVisit)
application.use("/eventNotify", eventNotify)
application.use("/calendar", calendar)
application.use("/tag", tag)

// main error catcher
application.app.use(errorCatcher(()=> logger))

application.start = function() {
    let port = Number(process.env.WEBAPI_PORT)
    logger.log(`Server starting...`)
    this.listen(port)
    logger.log(`Server is listening to port ${port}`)
}

export { 
    application
}
