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

describe ("Person API", ()=> {

    let auth = null
    let person = null

    it ("create person", async ()=> {
        await sleep(350)
        global.creds2 = {
            email: "ivanov1268@example.com",
            password: "123456789asdfghjkl"
        }
        let result = await ax.request({
            method: "post",
            url: "/person/create",
            data: {
                person: {
                    name: "Ivan Ivanov",
                    isPublic: true,
                    email: global.creds2.email,
                    password: global.creds2.password
                }
            }
        })
        person = result.data.person
        expect(result.status).to.be.oneOf([200, 409])
    })

    it ("log in", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "post",
            url: "/auth/login",
            data: {
                email: global.creds2.email,
                password: global.creds2.password 
            }
        })
        expect(result.status).to.equal(200)
        person = result.data.person
        auth = result.data.session
    })

    it ("view person", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "get",
            url: "/person/view",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            params: {
                id: person.id
            }
        })
        person = result.data.person
        expect(result.status).to.equal(200)
    })

    it ("update person", async ()=> {
        await sleep(300)
        // global.creds2.oldPassword = global.creds2.password
        // global.creds2.password = "1234567890123"
        let result = await ax.request({
            method: "post",
            url: "/person/update",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            params: {
                id: person.id 
            },
            data: {
                person: { 
                    name: person.name,
                    biography: "Someone Someone",
                    isPublic: person.isPublic,
                    tags: [ "online" ]
                }
            }
        })
        person = result.data.person
        expect(result.status).to.equal(200)
    })

})
