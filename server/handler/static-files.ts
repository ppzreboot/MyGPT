import type { I_route } from '../type.ts'
import { serveDir } from '@std/http'

export
const route__static: I_route = (method, url) => {
    if (method === 'GET' && !url.pathname.startsWith('/api'))
        return function(req) {
            return serveDir(req, {
                fsRoot: '_static',
            })
        }
    return null
}
