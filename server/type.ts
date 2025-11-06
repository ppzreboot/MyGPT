import type { I_app_service } from './main/main.ts'

export
interface I_app_env {
   app_mode: 'development' | 'production'
    port: number
    session_duration: number
    github_oauth_client_id: string
    llm_base_url: string

    mongo_db_uri: string
    github_oauth_client_secret: string
    llm_api_key: string
}

export
interface I_handler_other {
    url: URL
}

export
type I_http_handler = (req: Request, service: I_app_service, other: I_handler_other) => Response | Promise<Response>

export
type I_HTTP_method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'

export
type I_route = (method: I_HTTP_method, url: URL) => null | I_http_handler
