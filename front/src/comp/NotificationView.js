import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatDate, formatTime, formatDateTime } from "@lib/dateTimeUtils.js"

export default {
    props: {
        notification: Object
    },
    render() {
        let notification = this.notification
        let event = this.notification.event
        let startsAt = new Date(event.startsAt)
        let endsAt = new Date(event.endsAt)
        return h("div", { }, [
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h(RouterLink, { to: { path: "/event/view", query: { id: event.id } } }, ()=> [
                    h("h3", { class: [ "mar-b-1", "button-1", "button-block" ] }, event.title)
                ])
            ]),
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Date and time"),
                h("p", { }, `Event starts at ${formatDateTime(event.startsAt)} UTC`),
                h("p", { class: [ "mar-b-1" ] }, `Event ends at ${formatDateTime(event.endsAt)} UTC`)
            ]),
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Location"),
                h("p", { class: [ "mar-b-1" ] }, event.location ?? "This event location is only visible to approved visitors.")
            ]),
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Notification"),
                h("p", { }, `Notify at ${formatDateTime(notification.notifyAt)} UTC`),
                notification.attempts > 0?
                h("p", { class: ["mar-b-1"] }, `Notify ${notification.attempts} times with ${Math.round(notification.interval / 60000)} min interval`) : 
                h("p", { class: ["mar-b-1"] }, "No pending notification attempts")
            ])
        ])
    }
}
