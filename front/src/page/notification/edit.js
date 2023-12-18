import { h } from "vue"
import { RouterLink } from "vue-router"

import { nestedObjectCopy } from "@lib/utils.js"

import EventCard from "@/comp/EventCard.js"
import NotificationEdit from "@/comp/NotificationEdit.js"

export default {
    props: {
        event: Number,
        create: Boolean
    },
    data() {
        return {
            notification1: null,
            notification2: null
        }
    },
    computed: {
        person() {
            return this.$storage.person?.id
        }
    },
    methods: {
        async getNotification() {
            let result = await this.$axios.request({
                method: "get",
                url: "/eventNotify/view",
                params: {
                    event: this.event,
                    person: this.person
                }
            })
            if (result.status == 200) {
                this.notification1 = result.data.eventNotification
            }
            else if (this.create) {
                result = await this.$axios.request({
                    method: "get",
                    url: "/event/view",
                    params: { id: this.event }
                })
                this.notification1 = {
                    create: true,
                    event: result.data.event,
                    eventId: this.event,
                    personId: this.person
                }
            }
            this.resetNotification()
        },
        async saveNotification() {
            if (this.notification2.create) {
                await this.$axios.request({
                    method: "post",
                    url: "/eventNotify/create",
                    data: {
                        eventNotification: this.notification2
                    }
                })
            }
            else {
                await this.$axios.request({
                    method: "post",
                    url: "/eventNotify/update",
                    data: {
                        eventNotification: this.notification2
                    }
                })
            }
            this.$router.push({ path: "/notification/view", query: { event: this.event } })
        },
        resetNotification() {
            this.notification2 = nestedObjectCopy(this.notification1)
        }
    },
    mounted() {
        this.$watch (
            ()=> this.event,
            ()=> this.getNotification(),
            { immediate: true }
        )
    },
    render() {
        return [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "Edit notification"),
                h("span", { class: [ "flex-grow" ] }, " ")
            ]),
            this.notification2? [
                h(EventCard, { class: ["mar-b-1"], event: this.notification2.event }),
                h(NotificationEdit, { notification: this.notification2 }),
                h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                    h("button", { class: ["button", "button-2", "accent-bad"], onClick: ()=> this.resetNotification() }, "Reset"),
                    h("span", { class: [ "flex-grow" ] }, " "),
                    h("button", { class: ["button", "button-1"], onClick: ()=> this.saveNotification() }, "Save changes")
                ]) 
            ] : 
            h("p", { }, "Loading, please wait...")
        ]
    }
}
