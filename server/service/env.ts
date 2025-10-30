import { is_positive_integer, is_real_string } from '../utils/type-checker.ts'

interface I_app_env {
    app_mode: 'development' | 'production'
    port: number
    session_duration: number
    github_oauth_client_id: string

    mongo_db_uri: string
}

export
function parse_app_env(): I_app_env {
    const app_mode = Deno.env.get('app_mode')
    if (app_mode !== 'development' && app_mode !== 'production')
        throw Error('app env error APP_MODE')
    const port = Number(Deno.env.get('port'))
    if (!is_positive_integer(port) || port < 8000 || port > 20000)
        throw Error('app env error: PORT')
    const session_duration = Number(Deno.env.get('session_duration'))
    if (!is_positive_integer(session_duration))
        throw Error('app env error: SESSION_DURATION')
    const github_oauth_client_id = Deno.env.get('github_oauth_client_id')
    if (!is_real_string(github_oauth_client_id))
        throw Error('app env error GITHUB_OAUTH_CLIENT_ID')

    console.log('APP ENV', {
        app_mode,
        port,
        session_duration: session_duration / 1000 / 3600 + ' hour(s)',
        github_oauth_client_id,
    })

    const mongo_db_uri = Deno.env.get('mongo_db_uri')
    if (!is_real_string(mongo_db_uri))
        throw Error('app env error: MONGO_DB_URI')

    return {
        app_mode,
        github_oauth_client_id,
        mongo_db_uri,
        session_duration,
        port,
    }
}
