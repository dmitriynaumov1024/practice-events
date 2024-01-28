import { h } from "vue"

import InputBox from "@/ctrl/InputBox.js"
import DateTimeBox from "@/ctrl/DateTimeBox.js"

export default {
    props: {
        notification: Object
    },
    render() {
        let notification = this.notification
        return h("div", { class: [ "card", "mar-b-1" ] }, [
            h(DateTimeBox, { value: notification.notifyAt ?? notification.event.startsAt, onUpdate: (value)=> notification.notifyAt = value }, {
                label: ()=> "Notify me at (UTC)"
            }),
            h(InputBox, { type: "number", value: notification.attempts ?? 1, onUpdate: (value)=> notification.attempts = Math.floor(value || 0) || notification.attempts }, {
                label: ()=> "Notification attempts"
            }),
            h(InputBox, { type: "number", value: Math.floor((notification.interval ?? 60000) / 60000), onUpdate: (value)=> notification.interval = Math.floor((value || 0) * 60000) || notification.interval }, {
                label: ()=> "Interval (minutes)"
            })
        ])
    }
}
