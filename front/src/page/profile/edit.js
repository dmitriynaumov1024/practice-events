import { h } from "vue"
import { nestedObjectCopy } from "@lib/utils.js"

import PersonEdit from "@/comp/PersonEdit.js"

export default {
    data(){
        return {
            person1: null,
            person2: null
        }
    },
    methods: {
        async getPerson() {
            if (!this.$storage.person?.id) this.$router.replace("/profile/login")
            let result = await this.$axios.request({
                method: "get",
                url: "/person/view",
                params: { id: this.$storage.person.id }
            })
            if (result.data.person) {
                this.person1 = result.data.person
                this.person1.tags = this.person1.tags.map(tag => `${tag.tag?? tag}`).join(" ")
                this.resetPerson()
            }
        },
        async savePerson() {
            let person = nestedObjectCopy(this.person2)
            person.tags = person.tags.split(/\s+/)
            if (!person.updatePassword) {
                person.password = person.newPassword = undefined
            }
            let result = await this.$axios.request({
                method: "post",
                url: "/person/update",
                params: { id: person.id },
                data: { person: person }
            })
            if (result.status == 200) {
                this.$router.push("/profile/view")
            }
        },
        resetPerson() {
            this.person2 = nestedObjectCopy(this.person1)
        }
    },
    mounted() {
        this.getPerson()
    },
    render() {
        return [
            // top row
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "Edit profile"),
                h("span", { class: [ "flex-grow" ] }, " ")
            ]),
            // edit
            this.person2?
            h(PersonEdit, { person: this.person2 }) :
            h("p", { }, "Loading, please wait..."),
            // bottom row
            this.person2?
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("button", { class: ["button", "button-2", "accent-bad"], onClick: ()=> this.resetPerson() }, "Reset"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("button", { class: ["button", "button-1"], onClick: ()=> this.savePerson() }, "Save changes")
            ]) 
            : null
        ]
    }
}
