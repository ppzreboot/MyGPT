import { I_app_model } from './mongo.ts'
import type { ObjectId } from 'mongodb'

export
function init_service__sign_up_in(app_model: I_app_model) {
    return async function(provider: 'github', oauth_id: string): Promise<string> {
        const user_oauth = await app_model.user_oauth.findOne({
            provider,
            oauth_id,
        })
        let userid: ObjectId
        const now = new Date()
        const session_token = crypto.randomUUID()
        if (user_oauth === null) {
            // sign up
            const inserted_user = await app_model.user.insertOne({
                is_friend: false,
                created_at: now,
                updated_at: now,
            })
            await app_model.user_oauth.insertOne({
                provider,
                oauth_id,
                userid: inserted_user.insertedId,
                created_at: now,
            })
            userid = inserted_user.insertedId
            // insert session on sign-up
            await app_model.session.insertOne({
                userid,
                session_token,
                created_at: now,
            })
        } else {
            // sign in
            const user = await app_model.user.findOne({
                _id: user_oauth.userid,
            })
            if (user === null)
                throw new Error('user not found during sign-in')
            userid = user._id
            // update session on sign-in
            const result = await app_model.session.updateOne(
                { userid },
                { $set: {
                    session_token,
                    created_at: now,
                }},
            )
            if (result.matchedCount !== 1) {
                console.error('error on updating session on sign-in', result)
                throw Error('no session found on sign-in')
            }
        }
        console.log('sign up/in successful', { userid })
        return session_token
    }
}
