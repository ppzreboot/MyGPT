export
function is_real_string(val: unknown): val is string {
    return typeof(val) === 'string' && val.length !== 0
}
