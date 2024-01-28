import { h } from "vue"

import InputBox from "@/ctrl/InputBox.js"
import DateTimeBox from "@/ctrl/DateTimeBox.js"
import TextBox from "@/ctrl/TextBox.js"
import ToggleButton from "@/ctrl/ToggleButton.js"

export default {
    props: {
        event: Object
    },
    render() {
        let event = this.event
        return h("div", { class: ["card", "mar-b-1"] }, [
            h(InputBox, { value: event.title, onUpdate: (value)=> event.title = value }, {
                label: ()=> "Title"
            }),
            h(InputBox, { value: event.tags, onUpdate: (value)=> event.tags = value }, {
                label: ()=> "Event tags (separated with whitespace)"
            }),
            h(DateTimeBox, { value: event.startsAt, onUpdate: (value)=> event.startsAt = value }, {
                label: ()=> "Event starts at"
            }),
            h(DateTimeBox, { value: event.endsAt, onUpdate: (value)=> event.endsAt = value }, {
                label: ()=> "Event ends at"
            }),
            h(InputBox, { value: event.location, onUpdate: (value)=> event.location = value }, {
                label: ()=> event.isPublic? "Event location" : "Event location (private)"
            }),
            h(ToggleButton, { value: event.isPublic, onUpdate: (value)=> event.isPublic = value }, {
                label: (value)=> value? "Event location is public" : "Event location is only visible to approved visitors"
            }),
            h(TextBox, { value: event.description, onUpdate: (value)=> event.description = value }, {
                label: ()=> "Event description"
            }),
            h(TextBox, { value: event.requirements, onUpdate: (value)=> event.requirements = value }, {
                label: ()=> "Requirements for visitors"
            }),
        ])
    }
}
