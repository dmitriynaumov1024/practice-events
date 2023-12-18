import { h } from "vue"
import { RouterLink } from "vue-router"

import InputBox from "@/ctrl/InputBox.js"

let emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export default {
    data() {
        return {
            name: "",
            email: "",
            password1: "",
            password2: "",
            message: undefined,
            success: false
        }
    },
    computed: {
        passwordMatch() {
            return this.password2.length < 1 || this.password1.length < 1 || this.password1 == this.password2
        },
    },
    methods: {
        validate() {
            if (this.password1 != this.password2) {
                this.message = "Passwords do not match"
            }
            else if (this.password1.length < 8 || this.password1.length > 64) {
                this.message = "Password should be 8...64 characters long"
            }
            else if (this.name.length < 2 || this.name.length > 40) {
                this.message = "Name should be 2...40 characters long"
            }
            else if (!this.email.match(emailRegex)) {
                this.message = "Email should be a vaild Email address"
            }
            else {
                return true
            }
        },
        async signupClick() {
            if (!this.validate()) return
            let result = await this.$axios.request({
                method: "post",
                url: "/person/create",
                data: {
                    person: {
                        name: this.name,
                        email: this.email,
                        password: this.password1
                    }
                }
            })
            if (result.status == 200 && result.data.success) {
                this.success = true
                setTimeout(()=> this.$router.push("/profile/login"), 5000)
            }
            else {
                this.message = result.data?.message || "Something went wrong. Most likely a network error."
            }
        }
    },
    render() {
        return [
            h("div", { class: ["mar-b-1"] }, [
                h("h3", { }, "Create new account")
            ]),
            this.success?
            h("div", { class: ["card", "pad-v-1"] }, [
                h("p", { class: ["mar-b-1"] }, "You have successfully created new account. You will be redirected to Login page in 5 seconds...")
            ]) : 
            h("div", { class: ["card"] }, [
                h(InputBox, { type: "text", value: this.name, onUpdate: (value)=> this.name = value }, {
                    label: ()=> "Name"
                }),
                h(InputBox, { type: "text", value: this.email, onUpdate: (value)=> this.email = value }, {
                    label: ()=> "Email address"
                }),
                h(InputBox, { type: "password", value: this.password1, onUpdate: (value)=> this.password1 = value }, {
                    label: ()=> "Password"
                }),
                h(InputBox, { type: "password", value: this.password2, onUpdate: (value)=> this.password2 = value }, {
                    label: ()=> "Repeat password"
                }),
                this.message? h("p", { class: ["mar-b-1", "text-error"] }, this.message) : null
            ]),
            this.success? 
            null : 
            h("div", { class: ["card", "pad-v-1", "flex-stripe"] }, [
                h(RouterLink, { class: ["button", "button-2", "accent-weak", "text-gray"], to: "/profile/login" }, ()=> "Go to Login"),
                h("button", { class: ["button", "button-1"], onClick: ()=> this.signupClick() }, "Sign up")
            ])
        ]
    }
}
