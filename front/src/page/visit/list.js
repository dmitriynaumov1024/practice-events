import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatDateTime, formatTime } from "@lib/dateTimeUtils.js"
import Pagination from "@/layout/Pagination.js"
import VisitCard from "@/comp/VisitCard.js"
import ToggleButton from "@/ctrl/ToggleButton.js"

const VisitListCtrl = {
    props: {
        archive: Boolean,
        approved: Boolean
    },
    methods: {
        toggleArchive() {
            this.$router.patchQuery({ archive: !this.archive })
        },
        toggleApproved() {
            this.$router.patchQuery({ approved: !this.approved })
        }
    },
    render() {
        return h("div", { class: ["flex-stripe", "flex-wrap"] }, [
            h(ToggleButton, { class: ["flex-grow"], value: this.archive, onUpdate: ()=> this.toggleArchive() }, {
                label: (value)=> value? "Showing archived visits" : "Showing active visits" 
            }),
            h(ToggleButton, { class: ["flex-grow"], value: this.approved, onUpdate: ()=> this.toggleApproved() }, {
                label: (value)=> value? "Showing approved visits" : "Showing not approved visits" 
            }),
        ])
    }
}

const VisitList = {
    props: {
        items: Array,
        prev: Number,
        next: Number,
        page: Number,
        event: Number,
        archive: Boolean,
        approved: Boolean
    },
    render() {
        return h(Pagination, this.$props, {
            item: ({ item })=> h(RouterLink, { to: { path: "/visit/view", query: { event: item.eventId } } }, ()=> [
                h(VisitCard, { visit: item })
            ]),
            topRow: ()=> h(VisitListCtrl, { page: this.page, prev: this.prev, next: this.next, archive: this.archive, approved: this.approved })
        })
    }
}

export default { 
    props: {
        page: Number,
        event: Number,
        archive: Boolean,
        approved: Boolean
    },
    data() {
        return {
            items: null,
            prev: null,
            next: null
        }
    },
    methods: {
        async getVisitList() {
            let result = await this.$axios.request({
                method: "get",
                url: "/eventVisit/list",
                cacheTTL: 1000,
                params: { 
                    page: this.page, 
                    archive: this.archive,
                    event: this.event,
                    approved: this.approved,
                    person: this.event? undefined : this.$storage.person?.id
                }
            })
            if (result.data?.items) {
                this.items = result.data.items
                this.prev = result.data.prev
                this.next = result.data.next
            }
        }
    },
    mounted() {
        this.$watch (
            ()=> [ this.page, this.event, this.archive, this.approved ],
            ()=> this.getVisitList(),
            { immediate: true }
        )
    },
    render() {
        return h("div", { }, [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, this.event? "Event visits" : "My event visits"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`),
            ]),
            h(VisitList, { page: this.page, event: this.event, archive: this.archive, approved: this.approved, items: this.items, prev: this.prev, next: this.next })
        ])
    }
}

