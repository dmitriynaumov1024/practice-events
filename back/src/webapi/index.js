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

class EventsWebApi extends Application 
{
    constructor() {
        // base constructor
        super()
    }

    async start() {
        // create base services
        this.logger = new ConsoleLogger()
        this.dbAdapter = new EventsDbAdapter()
        await this.dbAdapter.connect(Knex.parseEnv())

        // provide base services
        this.use(loggerProvider(()=> this.logger))
        this.use(dbProvider(()=> this.dbAdapter))

        // use middlewares
        this.use(requestLogger())
        this.use(userSession())
        this.use(jsonBodyParser())
        this.use(crossOrigin({ origins: "*" }))

        // use endpoints
        this.use("/auth", auth)
        this.use("/person", person)
        this.use("/event", event)
        this.use("/eventVisit", eventVisit)
        this.use("/eventNotify", eventNotify)
        this.use("/calendar", calendar)
        this.use("/tag", tag)

        // main error catcher
        this.app.use(errorCatcher(()=> this.logger))

        // listen to port
        let port = Number(process.env.WEBAPI_PORT)
        this.logger.log(`Server starting...`)
        this.listen(port)
        this.logger.log(`Server is listening to port ${port}`)
    }
}

export { 
    EventsWebApi
}
