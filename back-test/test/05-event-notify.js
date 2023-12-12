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

describe ("Event Notify API", ()=> {

    let auth = null
    let person = null
    let event = null
    let notification = null

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

    it ("create event notification", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "post",
            url: "/eventNotify/create",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            data: {
                eventNotification: {
                    eventId: event.id,
                    personId: person.id,
                    notifyAt: new Date(event.startsAt) - 3600000,
                    attempts: 1,
                    interval: 3600000
                }
            }
        })
        expect(result.status).to.equal(200)
        expect(result.data.eventNotification).to.be.instanceOf(Object)
    })

    it ("update event notification", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "post",
            url: "/eventNotify/update",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            data: {
                eventNotification: {
                    eventId: event.id,
                    personId: person.id,
                    notifyAt: new Date(event.startsAt) - 7200000,
                    attempts: 1,
                    interval: 3600000
                }
            }
        })
        expect(result.status).to.equal(200)
        expect(result.data.eventNotification).to.be.instanceOf(Object)
    })

    it ("view event notification", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "get",
            url: "/eventNotify/view",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            params: {
                event: event.id,
                person: person.id
            }
        })
        expect(result.status).to.equal(200)
        expect(result.data.eventNotification).to.be.instanceOf(Object)
    })

    it ("list event notifications", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "get",
            url: "/eventNotify/list",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            params: {
                person: person.id
            }
        })
        expect(result.status).to.equal(200)
        expect(result.data.items).to.be.instanceOf(Array)
    })

    it ("delete event notification", async ()=> {
        await sleep(300)
        let result = await ax.request({
            method: "delete",
            url: "/eventNotify/delete",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            params: {
                person: person.id,
                event: event.id
            }
        })
        expect(result.status).to.equal(200)
    })

    it ("delete event", async ()=> {
        await sleep(200)
        let result = await ax.request({
            method: "delete",
            url: "/event/delete",
            headers: {
                "Authorization": qs.stringify(auth)
            },
            params: {
                id: event.id
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
