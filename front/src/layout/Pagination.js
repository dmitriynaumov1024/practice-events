import { h } from "vue"
import PaginationCtrl from "@/ctrl/PaginationCtrl.js"

export default {
    props: {
        page: Number,
        prev: Number,
        next: Number,
        items: Array
    },
    render() {
        let topRow = null, bottomRow = null

        if (this.$slots.topRow) topRow = this.$slots.topRow({ page: this.page, prev: this.prev, next: this.next })

        if (this.$slots.bottomRow) bottomRow = this.$slots.bottomRow({ page: this.page, prev: this.prev, next: this.next })
        if (this.$slots.bottomRow == undefined) bottomRow = h(PaginationCtrl, { page: this.page, prev: this.prev, next: this.next })

        let items = (this.items?.length)?
            this.items.map(item => (this.$slots.item)? this.$slots.item({ item }) : h("p", { }, JSON.stringify(item))) :
            h("p", { class: [ "text-mono" ] }, "Nothing here yet...")

        return h("div", { }, [
            topRow,
            topRow? h("div", { class: ["mar-b-1"] }, " ") : null,
            items,
            bottomRow? h("div", { class: ["mar-b-1"] }, " ") : null,
            bottomRow
        ])
    }
}
