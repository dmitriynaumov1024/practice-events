import "dotenv/config"
import { Worker } from "./worker.js"
import { ConsoleLogger } from "logging"
import { EventsDbAdapter, Knex } from "database"
import { offsetDate, formatDateTime, diffDate, formatDiffDate } from "better-obj"

import Mailjet from "node-mailjet"

function createMailStub() {
    return {
        get type() {
            return "Stub"
        },
        async send (message) {
            return { message: "This stub works." }
        }
    }
}

function createMailjet() {
    let mailer = Mailjet.apiConnect (
        process.env.MAILJET_PUBLIC_KEY, 
        process.env.MAILJET_SECRET_KEY
    )
    return {
        get type() {
            return "Mailjet"
        },
        async send (message) {
            return await mailer
                .post("send", { version: "v3.1" })
                .request({ Messages: [ message ] })
        }
    }
}

const mailProviders = {
    "mailjet": createMailjet,
    [undefined]: createMailStub 
}

const knownMailTypes = {
    "mailjet": "mailjet"
}

function createEmailAdapter() {
    return mailProviders[knownMailTypes[process.env.MAIL_TYPE?.toLowerCase()]]()
}

class SendEmailWorker extends Worker
{
    get interval() {
        return 10000
    }

    async init() {
        this.logger = new ConsoleLogger()
        this.db = new EventsDbAdapter()
        this.mail = createEmailAdapter()
        this.senderEmail = process.env.MAIL_SENDER 
        await this.db.connect(Knex.parseEnv())
    }

    async action() {
        let notifications = await this.db.eventNotification.query()
            .withGraphJoined("[event, person]")
            .where("attempts", ">", 0)
            .where("notifyAt", "<", new Date())
            .limit(10)

        for (let notification of notifications) {
            await this.handleNotification(notification)
            notification.notifyAt = offsetDate(notification.notifyAt, notification.interval)
            notification.attempts -= 1
            await this.db.eventNotification.query()
                .where("eventId", notification.eventId)
                .where("personId", notification.personId)
                .update(notification)
        }
    }

    async handleNotification (notification) {
        this.logger.log(`Notifying user #${notification.personId} about event #${notification.eventId}`)
        try {
            let result = await this.mail.send({
                From: {
                    Email: this.senderEmail
                },
                To: [{
                    Email: notification.person.email
                }],
                Subject: "Event reminder",
                TextPart: `Hello there, ${notification.person.name}, we remind you that event '${notification.event.title}' `
                        + `is starting on ${formatDateTime(notification.event.startsAt)} UTC `
                        + `(${formatDiffDate(diffDate(new Date(), notification.event.startsAt))})`
            })
        }
        catch (error) {
            this.logger.error(error.stack)
        }
    }
}

export {
    SendEmailWorker
}
