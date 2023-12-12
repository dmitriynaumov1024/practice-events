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

describe ("Event API", ()=> {

    let auth = null
    let person = null
    let event = null

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
        auth = { sessionId: result.data.session.sessionId, password: result.data.session.password }
        person = result.data.person
    })

    it ("create event", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "post",
            url: "/event/create",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            data: {
                event: {
                    title: "Anime party",
                    description: "We WILL WATCH ONE PIECE ALL DAY LONG",
                    requirements: "PASS THE VIBE CHECK",
                    location: "http://meet2.example.com/g712aen1213ca142",
                    isPublic: true,
                    startsAt: "2023-12-15T07:30:00Z",
                    endsAt: "2023-12-15T20:00:00Z",
                    tags: [ "anime", "party" ]
                }
            }
        })
        expect(result.status).to.equal(200)
        event = result.data.event
    })

    it ("update event", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "post",
            url: "/event/update",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            params: {
                id: event.id
            },
            data: {
                event: {
                    title: "Anime party",
                    description: "We WEILL WATCH ONE PIECE AND DEMON SLAYER** ALL DAY LONG",
                    requirements: "PASS THE VIBE CHECK",
                    location: "http://meet2.example.com/g712aen1213ca142",
                    isPublic: true,
                    startsAt: "2023-12-15T07:30:00Z",
                    endsAt: "2023-12-15T22:00:00Z",
                    tags: [ "anime", "party", "online", "all" ]
                }
            }
        })
        expect(result.status).to.equal(200)
        event = result.data.event
    })

    it ("list events", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "get",
            url: "/event/list",
            params: {
                page: 1,
                owner: person.id,
                archive: (new Date() > new Date(event.endsAt))
            }
        })
        expect(result.status).to.equal(200)
        expect(result.data.items).to.be.instanceOf(Array)
        expect(result.data.items).to.have.lengthOf(1)
    }) 

    it ("view event", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "get",
            url: "/event/view",
            params: {
                id: event.id
            }
        })
        expect(result.status).to.equal(200)
        expect(result.data.event).to.be.instanceOf(Object)
    })

    it ("delete event", async ()=> {
        await sleep(200)
        let result = await ax.request({
            method: "delete",
            url: "/event/delete",
            params: {
                id: event.id
            },
            headers: {
                "Authorization": qs.stringify(auth)
            }
        })
        expect(result.status).to.equal(200)
        await sleep(100)
        result = await ax.request({
            method: "get",
            url: "/event/view",
            params: {
                id: event.id
            }
        })
        expect(result.status).to.equal(404)
    })

})
