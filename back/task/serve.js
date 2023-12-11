import { CleanupSessionWorker, SendEmailWorker } from "workers"
import { EventsWebApi } from "webapi"

await new CleanupSessionWorker().start()
await new SendEmailWorker().start()
await new EventsWebApi().start()
