import type { ObjectId } from 'mongodb'
import type { I_app_model } from './mongo.ts'
import { parse_cookie } from '../utils/parse-cookie.ts'

export
function init_service__session_maker(
    app_model: I_app_model,
    session_duration_ms: number,
) {
    return function session(req: Request) {
        async function get_current_user_id(): Promise<ObjectId
            | 'no session token'
            | 'invalid/expired session'
            >
        {
            const now = Date.now() // 提前取 now 的值
            const session_token = read_session_token(req)
            if (session_token === null)
                return 'no session token'
            const doc = await app_model.session.findOne({ session_token })
            if (doc === null)
                return 'invalid/expired session'
            if (now - doc.created_at.getTime() > session_duration_ms)
                return 'invalid/expired session'
            return doc.userid
        }
        async function get_current_user() {
            const user_id = await get_current_user_id()
            if (typeof(user_id) === 'string')
                return user_id

            const user = await app_model.user.findOne({ _id: user_id })
            if (!user)
                throw Error(`Session Service: user (${user_id}) not found`)
            return user
        }
        return {
            get_current_user_id,
            get_current_user,
            rm_session_token: 'session_token=; Path=/; Max-Age=0',
        }
    }
}

function read_session_token(req: Request) {
    const cookie_str = req.headers.get('cookie')
    if (cookie_str === null)
        return null
    const cookie = parse_cookie(cookie_str)
    const token = cookie.session_token
    if (typeof(token) !== 'string' || token.length === 0)
        return null
    return token
}
