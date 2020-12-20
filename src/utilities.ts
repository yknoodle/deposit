export const formatMap = (allocation, formatter) => {
    return Object.entries(allocation)
        .reduce((acc, [k, v]: [string, number]) => {
            acc[k] = formatter(v)
            return acc
        }, {})
}
export const format2dp = v => Math.round(v * 100) / 100
export const empty = obj => Object.keys(obj).length == 0
export const mergeMap = (v1, v2, merge) => {
    return Object.entries(v1).concat(Object.entries(v2))
        .reduce((acc, [k, v]) => {
            if (acc[k]) acc[k] = merge(acc[k], v)
            else acc[k] = v
            return acc
        }, {})
}
