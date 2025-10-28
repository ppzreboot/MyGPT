import { APP_ENV } from '@/back/service/env'
import { sign_up_in } from '@/back/service/sign-up-in'
import { cookies } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { NextRequest } from 'next/server'
import { get_userinfo_by_code } from 'ppz-oauth-login/github'


export
async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }>}): Promise<Response> {
    /* input */
    const auth_code = req.nextUrl.searchParams.get('code')
    const provider = (await params).provider
    if (typeof(auth_code) !== 'string' || auth_code.length === 0
        || provider !== 'github'
    ) {
        console.error('invalid input on oauth login', { auth_code, provider })
        return new Response('invalid input', { status: 400 })
    }

    /* get userid from oauth provider */
    const [err, userinfo] = await get_userinfo_by_code(auth_code, APP_ENV.github_client_id, APP_ENV.github_client_secret)
    if (err)
        return new Response('login failed', { status: 500 })

    /* sign up / sign in */
    const session_token = await sign_up_in('github', userinfo.id)

    /* respond */
    const cookie_store = await cookies()
    cookie_store.set('session_token', session_token, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60,
        path: '/',
        secure: APP_ENV.is_production,
        sameSite: 'lax',
    })
    return redirect('/', RedirectType.replace) // return `never`
}
