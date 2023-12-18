import { h } from "vue"
import { RouterLink } from "vue-router"

import { nestedObjectCopy } from "@lib/utils.js"

import EventCard from "@/comp/EventCard.js"
import VisitEdit from "@/comp/VisitEdit.js"

export default {
    props: {
        event: Number,
        create: Boolean,
        person: Number
    },
    data() {
        return {
            visit1: null,
            visit2: null
        }
    },
    methods: {
        async getVisit() {
            let result = await this.$axios.request({
                method: "get",
                url: "/eventVisit/view",
                params: {
                    event: this.event,
                    person: this.person ?? this.$storage.person?.id
                }
            })
            if (result.status == 200) {
                this.visit1 = result.data.eventVisit
            }
            else if (this.create) {
                result = await this.$axios.request({
                    method: "get",
                    url: "/event/view",
                    params: { id: this.event }
                })
                this.visit1 = {
                    create: true,
                    event: result.data.event,
                    eventId: this.event,
                    personId: this.person ?? this.$storage.person?.id
                }
            }
            this.resetVisit()
        },
        async saveVisit() {
            if (this.visit2.create) {
                await this.$axios.request({
                    method: "post",
                    url: "/eventVisit/create",
                    data: {
                        eventVisit: this.visit2
                    }
                })
            }
            else {
                await this.$axios.request({
                    method: "post",
                    url: "/eventVisit/update",
                    data: {
                        eventVisit: this.visit2
                    }
                })
            }
            this.$router.push({ path: "/visit/view", query: { event: this.event } })
        },
        resetVisit() {
            this.visit2 = nestedObjectCopy(this.visit1)
        }
    },
    mounted() {
        this.$watch (
            ()=> this.event,
            ()=> this.getVisit(),
            { immediate: true }
        )
    },
    render() {
        return [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "Edit visit"),
                h("span", { class: [ "flex-grow" ] }, " ")
            ]),
            this.visit2? [
                h(EventCard, { class: ["mar-b-1"], event: this.visit2.event }),
                h(VisitEdit, { visit: this.visit2 }),
                h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                    h("button", { class: ["button", "button-2", "accent-bad"], onClick: ()=> this.resetVisit() }, "Reset"),
                    h("span", { class: [ "flex-grow" ] }, " "),
                    h("button", { class: ["button", "button-1"], onClick: ()=> this.saveVisit() }, "Save changes")
                ]) 
            ] : 
            h("p", { }, "Loading, please wait...")
        ]
    }
}
