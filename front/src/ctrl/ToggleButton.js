import { h } from "vue"

export default {
    props: {
        value: undefined
    },
    emits: [
        "update"
    ],
    methods: {
        onChange() {
            this.$emit("update", !this.value)
        }
    },
    render() {
        return h("div", { class: ["flex-stripe", "mar-b-1"] }, [
            h("svg", { class: ["fancy-checkbox-button"], viewBox: "0 0 16 16", onClick: ()=> this.onChange() }, [
                this.value? 
                h("path", { "stroke-width": "2.5", stroke: "var(--color-accent)", fill: "none", d: "M 3 7 L 7 12 L 14.5 4" }) :
                null
            ]),
            h("label", { class: ["fancy-checkbox-label"], onClick: ()=> this.onChange() }, this.$slots.label(this.value)),
            h("div", { class: ["flex-grow"] })
        ])
    }
}
