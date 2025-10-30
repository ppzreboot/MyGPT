import type { I_app_service } from './main/main.ts'

export
type I_http_handler = (req: Request, service: I_app_service) => Promise<Response>

export
type I_route = (req: Request) => null | I_http_handler
