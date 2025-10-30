export
function parse_cookie(cookie_str: string): Record<string, string> {
    const cookie = cookie_str
        .split(';')
        .map(kv => {
            kv = kv.trim()
            const equal_pos = kv.indexOf('=')
            if (equal_pos < 1)
                // 等号在开头，或没有等号
                return null
            const key = kv.slice(0, equal_pos).trim()
            if (key.length === 0)
                return null
            const val = kv.slice(equal_pos + 1).trim()
            return [key, val]
        })
        .filter(kv => kv !== null)
    return Object.fromEntries(cookie)
}