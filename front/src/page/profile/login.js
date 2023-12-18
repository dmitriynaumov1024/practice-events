import { h } from "vue"
import { RouterLink } from "vue-router"

import InputBox from "@/ctrl/InputBox.js"

import { sessionTTL } from "@lib/axiosWrapper.js"

export default {
    data() {
        return {
            email: "",
            password: "",
            message: undefined
        }
    },
    methods: {
        async loginClick() {
            let result = await this.$axios.request({
                method: "post",
                url: "/auth/login",
                data: {
                    email: this.email,
                    password: this.password
                }
            })
            if (result.data.session) {
                let { session, person } = result.data
                this.$storage.session = session
                this.$storage.person = person
                this.$axios.setAuth(session)
                this.$router.push("/profile/view")
            }
            else {
                this.message = result.data.message || "Wrong Email and/or Password. Please check your input and try again."
            }
        }
    },
    mounted() {
        if (this.$storage.session) {
            if (new Date() - new Date(this.$storage.session.expiresAt) < sessionTTL / 2) {
                this.$router.replace("/profile/view")
            }
        }
    },
    render() {
        return [
            h("div", { class: ["mar-b-1"] }, [
                h("h3", { }, "Log in existing account")
            ]),
            h("div", { class: ["card"] }, [
                h(InputBox, { type: "text", value: this.email, onUpdate: (value)=> this.email = value }, {
                    label: ()=> "Email address"
                }),
                h(InputBox, { type: "password", value: this.password, onUpdate: (value)=> this.password = value }, {
                    label: ()=> "Password"
                }),
                this.message? h("p", { class: ["pad-v-1", "text-error"] }, this.message) : null
            ]),
            h("div", { class: ["card", "pad-v-1", "flex-stripe"] }, [
                h(RouterLink, { class: ["button", "button-2", "accent-weak", "text-gray"], to: "/profile/signup" }, ()=> "Go to Signup"),
                h("button", { class: ["button", "button-1"], onClick: ()=> this.loginClick() }, "Log in")
            ])
        ]
    }
}
