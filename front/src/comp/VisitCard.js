import { h } from "vue"
import { formatInterval, formatDateTime } from "@lib/dateTimeUtils.js"

import ToggleButton from "@/ctrl/ToggleButton.js"

export default {
    props: {
        visit: Object
    },
    render() {
        let visit = this.visit,
            event = this.visit.event
        return h("div", { class: [ "card-card", "pad-1", "mar-b-1" ] }, [
            h("h4", { class: ["mar-b-05"] }, event.title),
            h("p", { class: ["mar-b-05"] }, `Event happens ${formatInterval(event.startsAt, event.endsAt)} UTC`),
            h(ToggleButton, { value: visit.isApproved, class: ["mar-b-0"] }, {
                label: (value)=> value? "This visit is approved by event host" : "This visit is not approved yet"
            })
        ])
    }
}
