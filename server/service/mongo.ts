import { ObjectId, MongoClient } from 'mongodb'

export
type I_llm_key
    = 'grok-4-fast-reasoning'
    | 'grok-4-fast-non-reasoning'
    | 'grok-4-0709'

export
function init_service__mongo_db(connect_uri: string, db_name: string) {
    const client = new MongoClient(connect_uri)
    const db = client.db(db_name)

    return {
        user: db.collection<{
            name?: string
            is_friend: boolean
            created_at: Date
            updated_at: Date
        }>('user'),
        user_oauth: db.collection<{
            userid: ObjectId
            provider: 'github'
            oauth_id: string
            created_at: Date
        }>('user-oauth'),
        session: db.collection<{
            userid: ObjectId
            session_token: string
            created_at: Date
        }>('session'),

        chat: db.collection<{
            title: string
        }>('chat'),
        msg: db.collection<{
            chat_id: ObjectId
            user: string
            reasoning?: string
            assistant?: string
            model_type: I_llm_key
            created_at: Date
        }>('msg'),
    }
}

export
type I_app_model = ReturnType<typeof init_service__mongo_db>
