import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatDate, formatTime, formatDateTime } from "@lib/dateTimeUtils.js"

import ToggleButton from "@/ctrl/ToggleButton.js"

export default {
    props: {
        visit: Object
    },
    render() {
        let visit = this.visit
        let event = this.visit.event
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
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Approval"),
                h(ToggleButton, { value: visit.isApproved }, {
                    label: (value)=> value? "This visit is approved" : "This visit is not approved yet"
                })
            ]),
            h("div", { class: [ "card", "mar-b-1" ] }, [
                h("p", { class: [ "text-gray", "mar-b-05" ] }, "Motivation"),
                h("p", { class: [ "mar-b-1", "text-pre-wrap" ] }, visit.motivation)
            ]),
        ])
    }
}
