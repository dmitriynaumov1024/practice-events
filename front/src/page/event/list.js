import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatTime } from "@lib/dateTimeUtils.js"

import Pagination from "@/layout/Pagination.js"
import PaginationCtrl from "@/ctrl/PaginationCtrl.js"
import EventListCtrl from "@/ctrl/EventListCtrl.js"
import EventCard from "@/comp/EventCard.js"

const EventList = {
    props: {
        items: Array,
        prev: Number,
        next: Number,
        page: Number,
        tag: String,
        archive: Boolean
    },
    render() {
        return h(Pagination, { items: this.items, page: this.page, prev: this.prev, next: this.next }, {
            item: ({ item })=> h(RouterLink, { to: { path: "/event/view", query: { id: item.id } } }, ()=> [
                h(EventCard, { event: item })
            ]),
            topRow: ()=> [
                h(EventListCtrl, { class: ["mar-b-1"], page: this.page, prev: this.prev, next: this.next, tag: this.tag, archive: this.archive }),
                this.$storage.session? h(RouterLink, { to: "/event/edit", class: ["mar-b-1", "card-card", "pad-025", "text-bold", "text-gray", "text-center"] }, ()=> "+ Create Event") : null,
            ],
            bottomRow: ()=> h(PaginationCtrl, { page: this.page, prev: this.prev, next: this.next }),
        })
    }
}

export default { 
    props: {
        page: Number,
        archive: Boolean,
        tag: String,
        owner: Number
    },
    data() {
        return {
            items: null,
            prev: null,
            next: null
        }
    },
    methods: {
        async getEventList() {
            let result = await this.$axios.request({
                method: "get",
                url: "/event/list",
                cacheTTL: 60000,
                params: { 
                    page: this.page, 
                    archive: this.archive,
                    tag: this.tag,
                    owner: this.owner
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
            ()=> [ this.page, this.archive, this.tag ],
            ()=> this.getEventList(),
            { immediate: true }
        )
    },
    render() {
        return h("div", { }, [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "Events"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`)
            ]),
            h(EventList, { page: this.page, archive: this.archive, tag: this.tag, items: this.items, prev: this.prev, next: this.next })
        ])
    }
}
