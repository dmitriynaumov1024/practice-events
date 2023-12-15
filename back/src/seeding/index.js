// 
// seeding entry point
//

import { seedCalendar } from "./00-calendar.js"
import { seedPersonWithTag } from "./01-person-with-tag.js"
import { seedEventWithTag } from "./02-event-with-tag.js"
import { seedEventVisit } from "./03-event-visit.js"
import { seedEventNotification } from "./04-event-notification.js"

export class EventsDbSeeder 
{
    async seed (db) {
        let seedEssential = true
        let seedAll = process.env.ENVIRONMENT_TYPE == "development"

        if (seedEssential) {
            await seedCalendar(db)
        }

        if (seedAll) {
            await seedPersonWithTag(db)
            await seedEventWithTag(db)
            await seedEventVisit(db)
            await seedEventNotification(db)
        }

        console.log("[i]: Done!\n")
    }
}
