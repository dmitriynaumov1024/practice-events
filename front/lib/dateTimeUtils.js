function formatDate(date) {
    if (!(date instanceof Date)) date = new Date(date)
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`
}

function formatTime(date) {
    if (!(date instanceof Date)) date = new Date(date)
    return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`
}

function formatDateTime(date) {
    if (!(date instanceof Date)) date = new Date(date)
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} `
         + `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`
}

function formatInterval (start, end) {
    start = new Date(start)
    end = new Date(end)
    let startDateText = formatDate(start)
    let endDateText = formatDate(end)
    if (startDateText == endDateText) {
        return `${startDateText}, ${formatTime(start)} ~ ${formatTime(end)}`
    }
    else {
        return `${startDateText} ${formatTime(start)} ~ ${endDateText} ${formatTime(end)}`
    }
}

const daysInMonth = [
    31, 28, 31, 30, 31, 30,
    31, 31, 30, 31, 30, 31 
]

const daysOfWeek = [
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
]

function getDaysIn (year, month) {
    if (month == 2) {
        if (year % 400 == 0) return 29;
        else if (year % 100 == 0) return 28;
        else if (year % 4 == 0) return 29;
        else return 28;
    }
    else return daysInMonth[month-1]
}

function dayOfWeekOf (date) {
    return (date.getDay() + 6) % 7
}

function ymdToDate (year, month, day) {
    year = String(year).padStart(4, "0")
    month = String(month).padStart(2, "0")
    day = String(day).padStart(2, "0")
    return new Date(`${year}-${month}-${day}`)
}

function calendarDayOf (date) {
    return Math.floor(date.valueOf() / 86400000)
}

export {
    formatDate,
    formatTime,
    formatDateTime,
    formatInterval,
    daysInMonth,
    daysOfWeek,
    getDaysIn,
    dayOfWeekOf,
    ymdToDate,
    calendarDayOf
}
