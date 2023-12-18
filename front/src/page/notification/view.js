import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatTime } from "@lib/dateTimeUtils.js"
import NotificationView from "@/comp/NotificationView.js"

export default {
    props: {
        event: Number
    },
    data() {
        return {
            notification: null
        }
    },
    methods: {
        async getNotification() {
            if (!this.$storage.person?.id) {
                return this.$router.push("/profile/login")
            } 
            let result = await this.$axios.request({
                method: "get",
                url: "/eventNotify/view",
                params: { 
                    event: this.event,
                    person: this.$storage.person.id
                }
            })
            this.notification = result.data.eventNotification
        },
        editNotification() {
            this.$router.push({ path: "/notification/edit", query: { event: this.event } })
        },
        async deleteNotification() {
            await this.$axios.request({
                method: "delete",
                url: "/eventNotify/delete",
                params: { 
                    event: this.event,
                    person: this.$storage.person.id
                }
            })
            this.$router.push({ path: "/notification/list", query: { page: 1 } })
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
            h("div", { class: [ "flex-stripe", "flex-wrap", "flex-pad-1", "mar-b-1" ] }, [
                h("h3", { }, "Event notification"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`)
            ]),
            this.notification? [
                h(NotificationView, { notification: this.notification }),
                h("div", { class: [ "flex-stripe", "flex-wrap", "flex-pad-1", "mar-b-1" ] }, [
                    h("button", { onClick: ()=> this.deleteNotification(), class: ["button", "button-2", "accent-bad"] }, "Delete"),
                    h("button", { onClick: ()=> this.editNotification(), class: ["button", "button-1"] }, "Edit"),
                ])
            ] :
            h("p", { }, "Loading, please wait...")
        ]
    }
}
