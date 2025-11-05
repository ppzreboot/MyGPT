import { API_error, type I_response } from './_base'

export
type I_auth_status = {
    signed_in: true
} | {
    signed_in: false
    oauth_list: {
        key: 'github'
        link: string
    }[]
}

export
async function retrieve__auth_status() {
    const response = await fetch('/api/auth/status', {
      method: 'GET',
    })
    const data = await response.json() as I_response<I_auth_status>
    if (data.error)
        throw API_error('retrieve__auth_status', data.key)
    return data.data
}
