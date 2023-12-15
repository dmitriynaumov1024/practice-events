async function seedCalendar (db) {
    console.log("[i]: Seeding Calendar")
    let msInDay = 86400000
    let today = (new Date() / msInDay) | 0
    let days = []
    for (let d = today - 1000; d < today + 1000; d++) {
        days.push({ day: d })
    }
    await db.calendar.query().insertGraph(days)
}

export {
    seedCalendar
}
