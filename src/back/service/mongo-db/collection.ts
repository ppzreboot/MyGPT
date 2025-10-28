import { mongo_db } from "./_init";

export
const user_collection = mongo_db.collection('user')

export
const user_oauth_collection = mongo_db.collection('user-oauth')

export
const session_collection = mongo_db.collection('session')
