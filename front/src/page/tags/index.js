import { h } from "vue"
import { RouterLink } from "vue-router"
import Pagination from "@/layout/Pagination.js"

let EventTagList = {
    props: {
        items: Array,
        prev: Number,
        next: Number,
        page: Number
    },
    render() {
        return h(Pagination, this.$props, {
            item: ({ item })=> h(RouterLink, { to: { path: "/event/list", query: { page: 1, tag: item.tag } }, class: [ "card", "flex-stripe", "pad-05" ] }, ()=> [
                h("h4", { class: ["text-accent"] }, `#${item.tag}`),
                h("p", { class: ["text-gray"] }, `${item.count} events`),
            ])
        })
    }
}

export default {
    props: {
        page: Number
    },
    data() {
        return {
            items: null,
            prev: null,
            next: null
        }
    },
    methods: {
        async getTagList() {
            let result = await this.$axios.request({
                method: "get",
                url:  "/tag/list",
                params: { page: this.page }
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
            ()=> [ this.page ],
            ()=> this.getTagList(),
            { immediate: true }
        )
    },
    render() {
        return [
            h("div", { class: [ "flex-stripe", "flex-wrap", "mar-b-1" ] }, [
                h("h3", { }, "Event tags"),
                h("span", { class: [ "flex-grow" ] }, " ")
            ]),
            h(EventTagList, { items: this.items, page: this.page, prev: this.prev, next: this.next })
        ]
    }
}
