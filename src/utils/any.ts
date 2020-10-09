export const isNumber = (value: any): boolean => {
    if (typeof value === 'number') return true
    if (typeof value !== 'string') return false
    return !isNaN(parseInt(value))
}

export const toNumber = (value: any): number | null => {
    if (typeof value === 'number') return value
    if (typeof value !== 'string') return null
    const number = parseInt(value)

    return isNaN(number) ? null : number
}