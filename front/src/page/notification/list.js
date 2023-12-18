import { h } from "vue"
import { RouterLink } from "vue-router"
import { formatDateTime, formatTime } from "@lib/dateTimeUtils.js"
import Pagination from "@/layout/Pagination.js"
import NotificationCard from "@/comp/NotificationCard.js"
import ToggleButton from "@/ctrl/ToggleButton.js"

const NotificationListCtrl = {
    props: {
        archive: Boolean
    },
    methods: {
        toggleArchive() {
            this.$router.patchQuery({ archive: !this.archive })
        }
    },
    render() {
        return h("div", { }, [
            h(ToggleButton, { value: this.archive, onUpdate: ()=> this.toggleArchive() }, {
                label: (value)=> value? "Showing archived notifications" : "Showing active notifications" 
            })
        ])
    }
}

const NotificationList = {
    props: {
        items: Array,
        prev: Number,
        next: Number,
        page: Number,
        archive: Boolean
    },
    render() {
        return h(Pagination, this.$props, {
            item: ({ item })=> h(RouterLink, { to: { path: "/notification/view", query: { event: item.eventId } } }, ()=> [
                h(NotificationCard, { notification: item })
            ]),
            topRow: ()=> h(NotificationListCtrl, { class: ["mar-b-1"], page: this.page, prev: this.prev, next: this.next, archive: this.archive })
        })
    }
}

export default { 
    props: {
        page: Number,
        archive: Boolean
    },
    data() {
        return {
            items: null,
            prev: null,
            next: null
        }
    },
    methods: {
        async getNotificationList() {
            let result = await this.$axios.request({
                method: "get",
                url: "/eventNotify/list",
                cacheTTL: 1000,
                params: { 
                    page: this.page, 
                    archive: this.archive,
                    person: this.$storage.person.id
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
            ()=> [ this.page, this.archive ],
            ()=> this.getNotificationList(),
            { immediate: true }
        )
    },
    render() {
        return h("div", { }, [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "My notifications"),
                h("span", { class: [ "flex-grow" ] }, " "),
                h("span", { }, `Now: ${formatTime(this.$timer.time)} UTC`),
            ]),
            h(NotificationList, { page: this.page, archive: this.archive, items: this.items, prev: this.prev, next: this.next })
        ])
    }
}

