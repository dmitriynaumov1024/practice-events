import { h } from "vue"

export default {
    props: {
        prev: Number,
        next: Number,
        page: Number
    },
    methods: {
        pageMinus() {
            if (this.prev) this.$router.patchQuery({ page: this.prev })
        },
        pagePlus() {
            if (this.next) this.$router.patchQuery({ page: this.next })
        }
    },
    render() {
        return h("div", { class: [ "flex-stripe" ] }, [
            // prev page button
            this.prev?
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.pageMinus() }, "<") :
                h("button", { class: [ "button", "button-2", "accent-weak" ] }, "<"),
            
            // page number
            h("span", { class: [ "flex-grow", "text-center" ] }, `Page ${this.page}`),
            
            // next page button
            this.next?
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.pagePlus() }, ">") :
                h("button", { class: [ "button", "button-2", "accent-weak" ] }, ">"),
        ])
    }
}
