import { init_service__mongo_db } from '../service/mongo.ts'
import { parse_app_env } from '../service/env.ts'
import { init_service__session_maker } from '../service/session.ts'
import { init_server } from './init-server.ts'

import { route__login } from '../handler/login.ts'

const env = parse_app_env()
const app_model = init_service__mongo_db(env.mongo_db_uri, 'MyGPT')
const session_maker = init_service__session_maker(app_model, env.session_duration)

const service = {
    env,
    app_model,
    session_maker,
}

init_server(env.port, service, [
    route__login,
])

export
type I_app_service = typeof service
