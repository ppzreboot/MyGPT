import { cookies } from 'next/headers'
import { session_collection, user_collection } from './mongo-db/collection'
import { session_duration_ms } from '@/front-back/const'

export
async function get_current_userid() {
    const cookie_store = await cookies()
    const session_token = cookie_store.get('session_token')?.value
    if (session_token === undefined)
        return 'no session token'

    const session = await session_collection.findOne({
        session_token
    })
    if (session === null)
        return 'invalid/expired session token'
    if (session.created_at.getTime() + session_duration_ms < Date.now())
        return 'expired session token'

    return session.userid
}

export
async function get_current_user() {
    const userid = await get_current_userid()
    if (typeof(userid) === 'string')
        return userid
    const user = await user_collection.findOne({
        _id: userid
    })
    if (user === null)
        throw new Error(`user not found: ${userid}`)

    return user
}
