export const pick = (obj: any, keys: string[]): any => {
    const result: any = {}
    keys.forEach(key => {
        result[key] = obj[key]
    })

    return result
}