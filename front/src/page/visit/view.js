import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatTime } from "@lib/dateTimeUtils.js"
import VisitView from "@/comp/VisitView.js"

export default {
    props: {
        event: Number,
        person: Number
    },
    data() {
        return {
            visit: null
        }
    },
    methods: {
        async getVisit() {
            if (!this.$storage.person?.id) {
                return this.$router.push("/profile/login")
            } 
            let result = await this.$axios.request({
                method: "get",
                url: "/eventVisit/view",
                params: { 
                    event: this.event,
                    person: this.person ?? this.$storage.person.id
                }
            })
            this.visit = result.data.eventVisit
        },
        editVisit() {
            this.$router.push({ path: "/visit/edit", query: { event: this.event } })
        },
        async deleteVisit() {
            await this.$axios.request({
                method: "delete",
                url: "/eventVisit/delete",
                params: { 
                    event: this.event,
                    person: this.person ?? this.$storage.person.id
                }
            })
            this.$router.push({ path: "/visit/list", query: { page: 1 } })
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
            h("div", { class: [ "flex-stripe", "flex-wrap", "flex-pad-1", "mar-b-1" ] }, [
                h("h3", { }, "Event visit"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`)
            ]),
            this.visit? [
                h(VisitView, { visit: this.visit }),
                h("div", { class: [ "flex-stripe", "flex-wrap", "flex-pad-1", "mar-b-1" ] }, [
                    h("button", { onClick: ()=> this.deleteVisit(), class: ["button", "button-2", "accent-bad"] }, "Delete"),
                    h("button", { onClick: ()=> this.editVisit(), class: ["button", "button-1"] }, "Edit"),
                ])
            ] :
            h("p", { }, "Loading, please wait...")
        ]
    }
}
