import type { I_app_service } from './main/main.ts'

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
