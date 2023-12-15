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

describe ("Calendar API", ()=> {

    it ("get month summary", async ()=> {
        for (let year=2022; year<2025; year+=1) {
            for (let month=1; month<=12; month+=1) {
                await sleep(4)
                let result = await ax.request({
                    method: "get",
                    url: "/calendar/monthSummary",
                    params: { month, year, tag: "online" }
                })
                expect(result.status).to.equal(200)
                expect(result.data.items).to.be.instanceOf(Array)
                if (result.data.items.length) {
                    expect(result.data.items[0]).to.have.all.keys("date", "calendarDay", "count")
                }
            }
        }
    })

    it ("get day summary", async ()=> {
        let year = "2023", month = "12"
        for (let day=1; day<30; day+=1) {
            await sleep(4)
            let result1 = await ax.request({
                method: "get",
                url: "/calendar/daySummary",
                params: { date: `${year}-${month}-${day}`, page: 1 }
            })
            expect(result1.status).to.equal(200)
            expect(result1.data.items).to.be.instanceOf(Array)
            let result2 = await ax.request({
                method: "get",
                url: "/calendar/daySummary",
                params: { date: `${year}-${month}-${day}`, page: 1, tag: "online" }
            })
            expect(result2.status).to.equal(200)
            expect(result2.data.items).to.be.instanceOf(Array)
            expect(result2.data.items.length).to.be.at.most(result1.data.items.length)
        }
    })

})
