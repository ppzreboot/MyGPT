import { get_github_login_url } from "@ppz/oauth-login/github";
import type { I_route } from '../type.ts'

export
const route__home: I_route = (method, url) => {
    if (method === 'GET' && url.pathname === '/')
        return function(req, service) {
            return new Response(
                `
                    <a href='${get_github_login_url(service.env.github_oauth_client_id)}'>Login with Github</a>
                `,
                {
                    headers: {
                        'Content-Type': 'text/html',
                    }
                },
            )
        }
    return null
}
