import { h } from "vue"

export default {
    props: {
        prev: Number,
        next: Number,
        page: Number,
        tag: String,
        archive: Boolean
    },
    methods: {
        pageMinus() {
            if (this.prev) this.$router.patchQuery({ page: this.prev })
        },
        pagePlus() {
            if (this.next) this.$router.patchQuery({ page: this.next })
        },
        toggleArchive() {
            this.$router.patchQuery({ page: 1, archive: !this.archive })
        },
        setTag() {
            let tag = this.$refs.tagInput.value.toLowerCase()
            if (!tag.length) tag = undefined
            if (tag != this.tag) this.$router.patchQuery({ tag })
        }
    },
    render() {
        return h("div", { class: [ "flex-stripe" ] }, [
            // archive button
            h("button", { class: [ "button", this.archive? "button-1" : "button-2" ], onClick: ()=> this.toggleArchive() }, "Archive"),
            h("span", { class: ["flex-grow"] }, " "),
            // tag input
            h("input", { type: "text", value: this.tag, ref: "tagInput", maxlength: 30, placeholder: "tag", class: [ "button", "button-2" ], style: { width: "50%", textAlign: "start" } }),
            h("button", { class: [ "button", "button-1" ], onClick: ()=> this.setTag() }, "Q")
        ])
    }
}
