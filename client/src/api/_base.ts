export
type I_response<Data> = {
    error: true
    key: string
} | {
    error: false
    data: Data
}

export
function API_error(api_name: string, msg: string) {
    return new Error(`API Error - ${api_name} - ${msg}`)
}
