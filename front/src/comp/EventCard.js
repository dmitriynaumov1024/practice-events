import { h } from "vue"
import { formatInterval } from "@lib/dateTimeUtils.js"

export default {
    props: {
        event: Object
    },
    render() {
        return h("div", { class: [ "card-card", "pad-1", "mar-b-1" ] }, [
            h("h4", { }, this.event.title),
            h("p", { }, `${formatInterval(this.event.startsAt, this.event.endsAt)} UTC`),
        ])
    }
}
