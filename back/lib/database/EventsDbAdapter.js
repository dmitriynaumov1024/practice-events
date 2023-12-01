import { DbAdapter } from "better-obj"

import { 
    Person, PersonTag, UserSession, Calendar,
    Event, EventTag, EventVisit, EventNotification 
} from "models"

class EventsDbAdapter extends DbAdapter 
{
    constructor() {
        super({
            // models must be supplied in the right order 
            // to avoid dependency issues
            calendar: Calendar,
            person: Person,
            personTag: PersonTag, 
            userSession: UserSession,
            event: Event,
            eventTag: EventTag,
            eventVisit: EventVisit,
            eventNotification: EventNotification
        })
    }
}

export {
    EventsDbAdapter
}
