import type { I_http_handler, I_route } from '../../type.ts'
import { get_userinfo_by_code } from '@ppz/oauth-login/github'
import { is_real_string } from '../../utils/type-checker.ts'

export
const route__login: I_route = (method, url) => {
    if (method === 'GET' && url.pathname.startsWith('/api/login'))
        return login_with_code
    return null
}

const login_with_code: I_http_handler = async (_, service, { url }) => {
    const auth_code = url.searchParams.get('code')
    if (!is_real_string(auth_code))
        return Response.json({
            error: true,
            key: 'no code'
        })
    
    const [oauth_error, userinfo] = await get_userinfo_by_code(auth_code, service.env.github_oauth_client_id, service.env.github_oauth_client_secret)
    if (oauth_error !== 0) {
        const err_key = 'failed to get oauth_id'
        console.error(err_key, oauth_error)
        return Response.json({
            error: true,
            key: err_key,
        })
    }

    // @ts-ignore: 这好像是 deno 的 bug
    const session_token = await service.sign_up_in('github', userinfo.id)
    const cookie_str = `session_token=${
        session_token
        }; Max-Age=${
        service.env.session_duration / 1000
        }; ${
        service.env.app_mode === 'production' ? 'Secure;' : ''
        } HttpOnly; Path=/`
    return new Response(null, {
        status: 302,
        headers: {
            Location: '/',
            'Set-Cookie': cookie_str,
        },
    })
}
