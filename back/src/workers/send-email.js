import "dotenv/config"
import { Worker } from "./worker.js"
import { ConsoleLogger } from "logging"
import { EventsDbAdapter, Knex } from "database"
import { offsetDate } from "better-obj"

class SendEmailWorker extends Worker
{
    get interval() {
        return 10000
    }

    async init() {
        this.logger = new ConsoleLogger()
        this.db = new EventsDbAdapter()
        await this.db.connect(Knex.parseEnv())
    }

    async action() {
        let notifications = await this.db.eventNotification.query()
            .joinRelated("event")
            .joinRelated("person")
            .where("attempts", ">", 0)
            .where("notifyAt", "<", new Date())
            .limit(10)

        for (let notification of notifications) {
            notification.notifyAt = offsetDate(notification.notifyAt, notification.interval)
            notification.attempts -= 1
            await this.db.eventNotification.query()
                .where("eventId", notification.eventId)
                .where("personId", notification.personId)
                .update(notification)
            await this.handleNotification(notification)
        }
    }

    async handleNotification (notification) {
        // this is definitely a stub.
        this.logger.log(`Notifying user #${notification.personId} about event #${notification.eventId}`)
    }
}

export {
    SendEmailWorker
}
