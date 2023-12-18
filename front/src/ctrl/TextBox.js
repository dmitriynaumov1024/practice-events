import { h } from "vue"

export default {
    props: {
        value: undefined,
        modelValue: undefined
    },
    emits: [
        "update"
    ],
    data() {
        return {
            id: "input-" + this.$idSequence.next()
        }
    },
    methods: {
        onChange() {
            let value = this.$refs.input.value,
                type = this.type?.toLowerCase()
            if (type == "text" || type == "string") {
                value = value
            }
            else if (type == "number") {
                value = Number(value)
                if (Number.isNaN(value)) value = props.modelValue
            }
            else if (type == "boolean") {
                value = value == "true"
            }
            this.$emit("update", value)
        }
    },
    render() {
        return h("div", { class: ["fancy-textarea"] }, [
            h("label", { for: this.id, class: ["text-gray"] }, this.$slots.label()),
            h("textarea", { ref: "input", id: this.id, value: this.value ?? this.modelValue, onChange: ()=> this.onChange() })
        ])
    }
}
