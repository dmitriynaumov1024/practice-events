import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatTime } from "@lib/dateTimeUtils.js"

import EventView from "@/comp/EventView.js"

export default { 
    props: {
        id: Number
    },
    data() {
        return {
            event: null
        }
    },
    methods: {
        async getEvent() {
            let result = await this.$axios.request({
                method: "get",
                url: "/event/view",
                cacheTTL: 10000,
                params: { 
                    id: this.id
                }
            })
            if (result.data?.event) {
                this.event = result.data.event
            }
        },
        editEvent() {
            this.$router.push({ path: "/event/edit", query: { id: this.event.id } })
        },
        async deleteEvent() {
            let result = await this.$axios.request({
                method: "delete",
                url: "/event/delete",
                headers: {
                    "Content-Type": "application/json"
                },
                params: {
                    id: this.id
                }
            })
            this.$router.push({ path: "/event/list", query: { page: 1 } })
        },
        visitEvent() {
            this.$router.push({ path: "/visit/edit", query: { event: this.event.id, create: true } })
        },
        notifyEvent() {
            this.$router.push({ path: "/notification/edit", query: { event: this.event.id, create: true } })
        }
    },
    mounted() {
        this.$watch (
            ()=> [ this.id ],
            ()=> this.getEvent(),
            { immediate: true }
        )
    },
    render() {
        let imOwner = this.event && this.$storage.person?.id == this.event?.ownerId,
            imVisitor = this.event && this.$storage.person?.id
        return h("div", { }, [
            h("div", { class: [ "flex-stripe", "flex-wrap", "flex-pad-1", "mar-b-1" ] }, [
                h("h3", { }, "Event"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`),
                imOwner? 
                h("button", { onClick: ()=> this.editEvent(), class: ["button", "button-2"] }, "Edit") :
                null
            ]),
            this.event? h(EventView, { event: this.event }) : null,
            imVisitor?
            h("div", { class: ["card", "pad-v-1"] }, [
                h("button", { onClick: ()=> this.visitEvent(), class: ["button-block", "button", "button-1", "pad-1", "mar-b-1"] }, "I would visit!"),
                h("button", { onClick: ()=> this.notifyEvent(), class: ["button", "button-inline", "button-block", "pad-05", "text-center"] }, "Notify me" )
            ]) :
            h("div", { class: ["flex-stripe", "card", "pad-v-1"] }, [
                h("p", { class: ["flex-grow"] }, "Log in or create account to visit this event"),
                h(RouterLink, { to: "/profile/login", class: ["button", "button-1"] }, ()=> "Log in")
            ]),
            imOwner? [
                h("div", { class: ["flex-stripe", "card", "pad-v-1"] }, [
                    h("p", { class: ["flex-grow"] }, `Estimated ${this.event.visitCount} visitors`),
                    h(RouterLink, { to: { path: "/visit/list", query: { event: this.event.id } }, class: ["button", "button-1"] }, ()=> "See")
                ]),
                h("div", { class: ["flex-stripe", "card", "pad-v-1"] }, [
                    h("p", { class: ["flex-grow"] }, "Delete this event"),
                    h("button", { onClick: ()=> this.deleteEvent(), class: ["button", "button-1", "accent-bad"] }, "DELETE")
                ]),
            ] : 
            null
        ])
    }
}