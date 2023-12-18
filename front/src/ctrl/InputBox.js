import { h } from "vue"

export default {
    props: {
        type: String,
        value: undefined,
        modelValue: undefined,
        disabled: Boolean
    },
    emits: [
        "update"
    ],
    data() {
        return {
            id: "input-" + this.$idSequence.next(),
            nativeType: (this.type?.toLowerCase() == "password")? "password" : "text"
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
        return h("div", { class: ["fancy-input"] }, [
            h("label", { for: this.id, class: ["text-gray"] }, this.$slots.label()),
            h("input", { ref: "input", id: this.id, type: this.nativeType, disabled: this.disabled, value: this.value ?? this.modelValue, onChange: ()=> this.onChange() })
        ])
    }
}
