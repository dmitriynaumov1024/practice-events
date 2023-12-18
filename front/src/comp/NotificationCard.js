import { h } from "vue"
import { formatInterval, formatDateTime } from "@lib/dateTimeUtils.js"

export default {
    props: {
        notification: Object
    },
    render() {
        let notification = this.notification,
            event = this.notification.event
        return h("div", { class: [ "card-card", "pad-1", "mar-b-1" ] }, [
            h("h4", { }, event.title),
            h("p", { }, `Event happens ${formatInterval(event.startsAt, event.endsAt)} UTC`),
            h("p", { }, `Notify at ${formatDateTime(notification.notifyAt)} UTC`),
            notification.attempts > 0?
            h("p", { }, `Notify ${notification.attempts} times with ${Math.round(notification.interval / 60000)} min interval`) : 
            h("p", { }, "No pending notification attempts")
        ])
    }
}
