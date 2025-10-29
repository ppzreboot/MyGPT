import { randomUUID } from 'crypto'
import { session_collection, user_collection, user_oauth_collection } from './mongo-db/collection'
import { ObjectId } from 'mongodb'

export
async function sign_up_in(provider: 'github', oauth_id: string): Promise<string> {
    const user_oauth = await user_oauth_collection.findOne({
        provider,
        oauth_id,
    })
    let userid: ObjectId
    const now = new Date()
    const session_token = randomUUID()
    if (user_oauth === null) {
        // sign up
        const inserted_user = await user_collection.insertOne({
            is_friend: false,
            created_at: now,
            updated_at: now,
        })
        await user_oauth_collection.insertOne({
            provider,
            oauth_id,
            userid: inserted_user.insertedId,
            created_at: now,
        })
        userid = inserted_user.insertedId
        // insert session on sign-up
        await session_collection.insertOne({
            userid,
            session_token,
            created_at: now,
        })
    } else {
        // sign in
        const user = await user_collection.findOne({
            _id: user_oauth.userid,
        })
        if (user === null)
            throw new Error('user not found during sign-in')
        userid = user._id
        // update session on sign-in
        await session_collection.updateOne(
            { userid },
            { $set: {
                session_token,
                created_at: now,
            }},
        )
    }
    return session_token
}
