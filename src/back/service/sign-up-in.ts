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
    if (user_oauth === null) {
        // sign up
        const inserted_user = await user_collection.insertOne({
            // ...
        })
        await user_oauth_collection.insertOne({
            provider,
            oauth_id,
            userid: inserted_user.insertedId,
        })
        userid = inserted_user.insertedId
    } else {
        // sign in
        const user = await user_collection.findOne({
            _id: user_oauth.userid,
        })
        if (user === null)
            throw new Error('user not found during sign-in')
        userid = user._id
    }
    const session_token = randomUUID()
    await session_collection.insertOne({
        userid,
        session_token,
    })
    return session_token
}
