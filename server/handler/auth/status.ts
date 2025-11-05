import { I_http_handler, I_route } from '../../type.ts'
import { get_github_login_url } from '@ppz/oauth-login/github'

export
const route__auth_status: I_route = (method, url) =>
    (method === 'GET' && url.pathname === '/api/auth/status')
        ? auth_status
        : null

const auth_status: I_http_handler = async (req, service) => {
    const user_id = await service.session(req).get_current_user_id()
    const signed_in = typeof(user_id) !== 'string'
    const oauth_list = signed_in
        ? null
        : [
            { key: 'github', link: get_github_login_url(service.env.github_oauth_client_id) },
        ]
    return Response.json({
        error: false,
        data: {
            signed_in,
            oauth_list,
        },
    })
}
