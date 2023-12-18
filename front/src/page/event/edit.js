import { h } from "vue"
import { nestedObjectCopy } from "@lib/utils.js"
import { formatDate, formatTime, formatDateTime } from "@lib/dateTimeUtils.js"

import EventView from "@/comp/EventView.js"
import EventEdit from "@/comp/EventEdit.js"

export default {
    props: {
        id: Number
    },
    data() {
        return {
            event1: { 
                title: "New event",
                description: "",
                requirements: "",
                location: "",
                isPublic: true,
                startsAt: this.$timer.time.toISOString(),
                endsAt: this.$timer.time.toISOString(),
                tags: "all"
            },
            event2: null,
            preview: false
        }
    },
    methods: {
        async getEvent() {
            if (!this.id) return this.resetEvent()
            let result = await this.$axios.request({
                method: "get",
                url: "/event/view",
                params: { id: this.id }
            })
            if (result.data.event) {
                this.event1 = result.data.event
                this.event1.tags = this.event1.tags.map(tag => tag.tag || tag).join(" ")
            }
            this.resetEvent()
        },
        resetEvent() {
            this.event2 = nestedObjectCopy(this.event1)
            this.preview = false
        },
        togglePreview() {
            console.log(this.event2)
            this.preview = !this.preview
        },
        async saveEvent() {
            let event = nestedObjectCopy(this.event2)
            event.tags = event.tags.split(/\s+/)
            if (this.id) {
                await this.updateEvent(event)
            }
            else {
                await this.createEvent(event)
            }
        },
        async createEvent (event) {
            let result = await this.$axios.request({
                method: "post",
                url: "/event/create",
                data: { event: event }
            })
            if (result.status == 200) {
                this.$router.patchQuery({ id: result.data.event.id })
            }
        },
        async updateEvent (event) {
            let result = await this.$axios.request({
                method: "post",
                url: "/event/update",
                params: { id: this.id },
                data: { event: event }
            })
            if (result.status == 200) {
                this.event1 = result.data.event
                this.$router.push({ path: "/event/view", query: { id: this.id } })
            }
        }
    },
    mounted() {
        this.$watch (
            ()=> this.id,
            ()=> this.getEvent(),
            { immediate: true } 
        )
    },
    render() {
        return h("div", { }, [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "Event"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`)
            ]),
            this.event2? (
                this.preview ? 
                h(EventView, { event: this.event2 }) :
                h(EventEdit, { event: this.event2 })
            ) :
            null,
            h("div", { class: [ "flex-stripe", "flex-pad-05", "flex-wrap", "mar-b-1" ] }, [
                h("button", { class: ["button", "button-2", "accent-error"], onClick: ()=> this.resetEvent() }, "Reset"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("button", { class: ["button", this.preview? "button-1" : "button-2" ], onClick: ()=> this.togglePreview() }, "Preview"),
                h("button", { class: ["button", "button-1"], onClick: ()=> this.saveEvent() }, "Save changes")
            ])
        ])
    }
}
