import { I_http_handler, I_route } from '../../type.ts'

export
const route__has_login: I_route = (method, url) =>
    (method === 'GET' || url.pathname === '/api/auth/has-login')
        ? check_has_login
        : null

const check_has_login: I_http_handler = async (req, service) => {
    const user_id = await service.session(req).get_current_user_id()
    return Response.json({
        error: false,
        data: typeof(user_id) !== 'string',
    })
}
