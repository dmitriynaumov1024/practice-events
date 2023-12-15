import "dotenv/config"
import { Worker } from "./worker.js"
import { UserSession } from "models"
import { ConsoleLogger } from "logging"
import { EventsDbAdapter, Knex } from "database"
import { offsetDate } from "better-obj"

class CleanupSessionWorker extends Worker
{
    get interval() {
        return 30000
    }

    async init() {
        this.logger = new ConsoleLogger()
        this.db = new EventsDbAdapter()
        await this.db.connect(Knex.parseEnv())
    }

    async action() {
        let deleted = await this.db.userSession.query().delete()
            .where("expiresAt", "<", offsetDate(-UserSession.TTL)) 
        this.logger.warn(`Cleaned up ${deleted} expired sessions`)
    }
}

export {
    CleanupSessionWorker
}
