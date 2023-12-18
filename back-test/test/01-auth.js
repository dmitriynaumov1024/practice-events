import global from "./global.js"
import axios from "axios"
import qs from "qs"
import { describe, it } from "mocha"
import chai from "chai"
const expect = chai.expect

async function sleep (ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

let ax = axios.create({
    baseURL: "http://localhost:8000",
    validateStatus() {
        return true
    }
})

describe ("Authentication/Authorization API", ()=> {

    it ("sign up", async ()=> {
        await sleep(350)
        global.creds = {
            email: "naumov671@gmail.com",
            password: "1234567890asdfg"
        }
        let result = await ax.request({
            method: "post",
            url: "/person/create",
            data: {
                person: {
                    name: "Dmitriy N.",
                    biography: "21 y.o. software engineer from Zaporizhia",
                    isPublic: true,
                    email: global.creds.email,
                    password: global.creds.password
                }
            }
        })
        if (result.status == 200) {
            expect(result.data).to.have.property("person")
            expect(result.data.person).to.have.property("id")
            global.person = result.data.person
            return
        }
    })

    it ("log in", async ()=> {
        await sleep(400)
        let result = await ax.request({
            method: "post",
            url: "/auth/login",
            data: {
                email: global.creds.email,
                password: global.creds.password
            }
        })
        global.auth = qs.stringify(result.data.session)
        if (!global.person) {
            global.person = { id: result.data.person.id }
        }
        expect(result.data.person).to.have.property("id")
        expect(result.data.session).to.have.property("sessionId")
        expect(result.data.session).to.have.property("password")
    })

    it ("refresh", async ()=> {
        await sleep(400)
        let result = await ax.request({
            method: "post",
            url: "/auth/refresh",
            headers: {
                "Authorization": global.auth
            }
        })
        global.auth = qs.stringify(result.data.session)
        expect(result.data.session).to.have.property("sessionId")
        expect(result.data.session).to.have.property("password")
    })

    it ("log out", async ()=> {
        await sleep(400)
        let result = await ax.request({
            method: "post",
            url: "/auth/logout",
            headers: {
                "Authorization": global.auth
            }
        })
        global.auth = null
    })

})
