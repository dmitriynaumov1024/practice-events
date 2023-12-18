import { h } from "vue"
import axios from "axios"

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
        pageMinus() {
            if (this.prev) this.$router.patchQuery({ page: this.prev })
        },
        pagePlus() {
            if (this.next) this.$router.patchQuery({ page: this.next })
        },
        async getPersonList() {
            let result = await this.$axios.request({
                method: "get",
                url: "/person/list",
                params: { page: this.page, archive: this.archive }
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
            ()=> this.page,
            ()=> this.getPersonList(),
            { immediate: true }
        )
    },
    render() {
        return h("div", [
            h("div", { class: [ "flex-stripe", "flex-pad-05", "mar-b-1" ] }, [
                h("button", { class: [ "button", "button-2" ], onClick: ()=> this.pageMinus() }, "<"),
                h("span", { }, `Page ${this.page}`),
                h("button", { class: [ "button", "button-2" ], onClick: ()=> this.pagePlus() }, ">"),
                h("span", { class: [ "flex-grow" ] }, " ")
            ]),
            this.items?.length ?
            this.items.map(item => JSON.stringify(item)) : 
            h("p", { }, "Nothing here yet...")
        ])
    }
}
