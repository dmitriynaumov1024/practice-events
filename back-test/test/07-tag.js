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

describe ("Tag API", ()=> {

    it ("get list of popular tags", async()=> {
        for (let page=1; page<10; page+=1) {
            await sleep(40)
            let result = await ax.request({
                method: "get",
                url: "/tag/list",
                params: { page }
            })
            expect(result.status).to.equal(200)
            expect(result.data.items).to.be.instanceOf(Array)
            if (result.data.items.length) {
                expect(result.data.items[0]).to.have.all.keys("tag", "count")
            }
            else {
                return
            }
        }
    })

})
