export
function is_real_string(val: unknown): val is string {
    return typeof(val) === 'string' && val.length > 0
}

export
function is_positive_integer(val: number): boolean {
    return Number.isSafeInteger(val) && val > 0
}
