import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatDate, formatTime, formatDateTime } from "@lib/dateTimeUtils.js"

export default {
    props: {
        event: Object
    },
    render() {
        let event = this.event,
            startsAt = new Date(event.startsAt),
            endsAt = new Date(event.endsAt)
        return h("div", { }, [
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("h3", { class: [ "mar-b-1", "button-1", "button-block" ] }, event.title),
                (event.tags instanceof Array)? 
                h("p", { class: [ "mar-b-1" ] }, event.tags.map((tag) => [
                    h(RouterLink, { to: { path: "/event/list", query: { page: 1, tag: tag.tag } }, class: ["link"] }, ()=> `#${tag.tag}`),
                    " "
                ])) :
                h("p", { class: [ "mar-b-1" ] }, event.tags.split(/\s+/).map((tag) => [
                    h(RouterLink, { to: { path: "/event/list", query: { page: 1, tag: tag } }, class: ["link"] }, ()=> `#${tag}`),
                    " "
                ]))
            ]),
            event.owner? h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Hosted by"),
                h("p", { }, event.owner.name),
                h("p", { class: [ "mar-b-1" ] }, event.owner.email)
            ]) : null,
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Date and time"),
                h("p", { }, `Event starts at ${formatDateTime(startsAt)} UTC`),
                h("p", { class: [ "mar-b-1" ] }, `Event ends at ${formatDateTime(endsAt)} UTC`)
            ]),
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, event.isPublic? "Location" : "Location (private)"),
                h("p", { class: [ "mar-b-1" ] }, event.location ?? "This event location is only visible to approved visitors.")
            ]),
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Description"),
                h("p", { class: [ "text-pre-wrap", "mar-b-1" ] }, event.description)
            ]),
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Requirements"),
                h("p", { class: [ "text-pre-wrap", "mar-b-1" ] }, event.requirements)
            ]),
        ])
    }
}
