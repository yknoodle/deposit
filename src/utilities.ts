export const formatMap = (allocation, formatter) => {
    return Object.entries(allocation)
        .reduce((acc, [k, v]: [string, number]) => {
            acc[k] = formatter(v)
            return acc
        }, {})
}
export const format2dp = v => Math.round(v * 100) / 100
export const empty = obj => Object.keys(obj).length == 0
export const mergeMap = (map1, map2, merge=(v1, v2)=>v1+v2) => {
    return Object.entries(map1).concat(Object.entries(map2))
        .reduce((acc, [k, v]) => {
            if (acc[k]) acc[k] = merge(acc[k], v)
            else acc[k] = v
            return acc
        }, {})
}
export const mergeArrayToMap = (array, kMapper, vMapper, merge) => {
    return array.reduce((acc, curr) => {
        const k = kMapper(curr)
        const v = vMapper(curr)
        if (acc[k]) acc[k] = merge(acc[k], v)
        else acc[k] = v
        return acc
    }, {})
}
/**
 * validates a map based on logic supplied by a validator
 * @param map to be validated
 * @param validator implements the validation logic
 * @param identifier
 * @returns array of validation errors depending on validator
 */
export const validate = (map, validator, identifier=map=>Object.entries(map)[0][1]) => {
    return Object.entries(map).map(validator)
        .filter(o => o != null)
        .map((err: object) => {return {key:identifier(map), ...err}})
}
export const flatten = (acc, curr) => acc.concat(curr)
