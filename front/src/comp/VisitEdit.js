import { h } from "vue"

import TextBox from "@/ctrl/TextBox.js"
import ToggleButton from "@/ctrl/ToggleButton.js"

export default {
    props: {
        visit: Object
    },
    render() {
        let visit = this.visit
        let imOwner = visit.event.ownerId == this.$storage.person?.id && !visit.create
        let eventInProgress = new Date(visit.event.startsAt) < new Date()
        return h("div", { class: [ "card", "mar-b-1" ] }, [
            h(TextBox, { value: visit.motivation, onUpdate: (value)=> visit.motivation = value }, {
                label: ()=> "Motivation (why you should be let in?)"
            }),
            imOwner?
            h(ToggleButton, { value: visit.isApproved, onUpdate: (value)=> visit.isApproved = value }, {
                label: ()=> "Approved"
            }) :
            null,
            eventInProgress?
            h(ToggleButton, { value: visit.isVisited, onUpdate: (value)=> visit.isVisited = value }, {
                label: ()=> "Actually visited"
            }) :
            null
        ])
    }
}
