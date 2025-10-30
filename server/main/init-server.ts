import { I_http_handler, I_HTTP_method, I_route } from '../type.ts'
import { I_app_service } from './main.ts'

export
function init_server(port: number, service: I_app_service, route_list: I_route[]) {
    Deno.serve(
        {
            port,
            onListen: () => {
                console.log('HTTP Server is listening on ' + port)
            },
        },
        req => {
            const url = new URL(req.url)
            for (const route of route_list) {
                const handler = route(req.method as I_HTTP_method, url)
                if (handler !== null) {
                    return _handle(req, handler, service, { url })
                }
            }
            console.error(`Not Found: ${req.method} ${req.url}`)
            return Response.json({
                error: 'Not Found'
            })
        },
    )
}

async function _handle(
    req: Request,
    handler: I_http_handler,
    service: I_app_service,
    other: { url: URL },
): Promise<Response> {
    try {
        return await handler(req, service, other)
    } catch(err) {
        console.error(err)
        return Response.json({
            error: 'Unknown Error'
        })
    }
}
