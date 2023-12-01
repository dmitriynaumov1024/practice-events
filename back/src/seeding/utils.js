class Random 
{
    static integer (min, max) {
        if (min == undefined) {
            min = 0
            max = 32767
        }
        if (max == undefined) {
            max = min
            min = 0
        }
        return ((Math.random() * (max - min)) | 0) - min
    }

    static float (min, max) {
        if (min == undefined) {
            max = 32767
        }
        if (max == undefined) {
            max = min
            min = 0
        }
        return (Math.random() * (max - min)) - min
    }

    static choice (items) {
        return items[this.integer(items.length-1)]
    }
}

export {
    Random
}
