import { I_http_handler, I_route } from '../type.ts'
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
            for (const route of route_list) {
                const handler = route(req)
                if (handler !== null)
                    return _handle(req, handler, service)
            }
            console.error(`Not Found: ${req.method} ${req.url}`)
            return Response.json({
                error: 'Not Found'
            })
        },
    )
}

async function _handle(req: Request, handler: I_http_handler, service: I_app_service): Promise<Response> {
    try {
        return await handler(req, service)
    } catch(err) {
        console.error(err)
        return Response.json({
            error: 'Unknown Error'
        })
    }
}
