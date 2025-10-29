import { ObjectId } from 'mongodb'
import { mongo_db } from './_init'

export
const user_collection = mongo_db.collection<{
    name?: string
    is_friend: boolean
    created_at: Date
    updated_at: Date
}>('user')

export
const user_oauth_collection = mongo_db.collection<{
    userid: ObjectId
    provider: 'github'
    oauth_id: string
}>('user-oauth')

export
const session_collection = mongo_db.collection<{
    userid: ObjectId
    session_token: string
}>('session')
