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
    year = Number(year)
    month = Number(month)
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

function ymdToDate (year, month, day, hour, minute) {
    year = clamp(year, 0, 9999)
    month = clamp(month, 1, 12)
    day = clamp(day, 1, getDaysIn(month - 1))
    hour = clamp(hour, 0, 23)
    minute = clamp(minute, 0, 59)
    let yearS = String(year).padStart(4, "0")
    let monthS = String(month).padStart(2, "0")
    let dayS = String(day).padStart(2, "0")
    let hourS = String(hour).padStart(2, "0")
    let minuteS = String(minute).padStart(2, "0")
    return new Date(`${yearS}-${monthS}-${dayS}T${hourS}:${minuteS}:00`)
}

function calendarDayOf (date) {
    return Math.floor(date.valueOf() / 86400000)
}

function clamp (value, min, max) {
    value = Number.parseInt(value)
    if (Number.isNaN(value) || value < min) return min
    if (value > max) return max
    return value
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
