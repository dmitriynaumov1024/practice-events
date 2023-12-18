import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatTime, ymdToDate } from "@lib/dateTimeUtils.js"

import CalendarCtrl from "@/ctrl/CalendarCtrl.js"
import CalendarGridView from "@/comp/CalendarGridView.js"
import Pagination from "@/layout/Pagination.js"
import EventCard from "@/comp/EventCard.js"


const DayEventList = {
    props: {
        items: Array,
        prev: Number,
        next: Number,
        page: Number
    },
    render() {
        return h(Pagination, { items: this.items, page: this.page, prev: this.prev, next: this.next }, {
            item: ({ item })=> h(RouterLink, { to: { path: "/event/view", query: { id: item.id } } }, ()=> h(EventCard, { event: item })),
        })
    }
}

export default {
    props: {
        year: Number,
        month: Number,
        day: Number,
        page: Number,
        tag: String
    },
    data() {
        return {
            items: null,
            prev: null,
            next: null
        }
    },
    methods: {
        async getMonthSummary() {
            let result = await this.$axios.request({
                method: "get",
                url: "/calendar/monthSummary",
                params: {
                    year: this.year,
                    month: this.month,
                    tag: this.tag
                }
            })
            if (result.data?.items) {
                this.items = result.data.items
            }
        },
        async getDaySummary() {
            let result = await this.$axios.request({
                method: "get",
                url: "/calendar/daySummary",
                params: {
                    date: ymdToDate(this.year, this.month, this.day),
                    page: this.page,
                    tag: this.tag
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
        this.$watch(
            ()=> [ this.month, this.year, this.day, this.page, this.tag ], 
            async ()=> await (this.day? this.getDaySummary() : this.getMonthSummary()), 
            { immediate: true }
        )
    },
    render() {
        return [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "Calendar"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`)
            ]),
            h(CalendarCtrl, this.$props),
            this.day? 
            h(DayEventList, { items: this.items, page: this.page ?? 1, prev: this.prev, next: this.next }) : 
            h(CalendarGridView, { year: this.year, month: this.month, items: this.items })
        ]
    }
}
