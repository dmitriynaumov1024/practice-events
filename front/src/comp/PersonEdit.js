import { h } from "vue"

import InputBox from "@/ctrl/InputBox.js"
import TextBox from "@/ctrl/TextBox.js"
import ToggleButton from "@/ctrl/ToggleButton.js"

export default {
    props: {
        person: Object
    },
    render() {
        let person = this.person
        return h("div", { class: [ "card", "mar-b-1" ] }, [
            h(InputBox, { value: person.name, onUpdate: (value)=> person.name = value }, {
                label: ()=> "Name"
            }),
            h(InputBox, { value: person.email, disabled: true }, {
                label: ()=> "Email (readonly)"
            }),
            h(TextBox, { value: person.biography, onUpdate: (value)=> person.biography = value }, {
                label: ()=> "Biography"
            }),
            h(InputBox, { value: person.tags, onUpdate: (value)=> person.tags = value }, {
                label: ()=> "Interested in Tags (separated with whitespace)"
            }),
            h(ToggleButton, { value: person.updatePassword, onUpdate: (value)=> person.updatePassword = value }, {
                label: (value)=> value? "Update password" : "Do not update password" 
            }),
            person.updatePassword? [
                h(InputBox, { type: "password", value: person.oldPassword, onUpdate: (value)=> person.oldPassword = value }, {
                    label: ()=> "Old password"
                }),
                h(InputBox, { type: "password", value: person.password, onUpdate: (value)=> person.password = value }, {
                    label: ()=> "New password"
                })
            ] : null
        ])
    }
}
