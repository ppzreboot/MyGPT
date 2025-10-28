import { is_real_string } from '@/utils/non-empty-string'

interface I_app_env {
    MONGODB_URI: string

    github_client_id: string
    github_client_secret: string
    grok_api_key: string
    is_production: boolean
}

export
const APP_ENV: I_app_env = (() => {
    const MONGODB_URI = process.env.MONGODB_URI
    if (!is_real_string(MONGODB_URI))
        throw Error('missing env var: mongodb uri')
    const github_client_id = process.env.github_oauth_client_id
    if (!is_real_string(github_client_id))
        throw Error('missing env var: github oauth client id')
    const github_client_secret = process.env.github_oauth_client_secret
    if (!is_real_string(github_client_secret))
        throw Error('missing env var: github oauth client secret')
    const app_mode = process.env.app_mode
    if (!is_real_string(app_mode))
        throw Error('missing env var: app mode')
    const grok_api_key = process.env.grok_api_key
    if (!is_real_string(grok_api_key))
        throw Error('missing env var: grok api key')
    return {
        MONGODB_URI,
        github_client_id,
        github_client_secret,
        grok_api_key,
        is_production: app_mode === 'production',
    }
})()
