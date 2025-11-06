import { init_service__mongo_db } from '../service/mongo.ts'
import { parse_app_env } from '../service/env.ts'
import { init_service__session_maker } from '../service/session.ts'
import { init_server } from './init-server.ts'
import { init_service__sign_up_in } from '../service/sign-up-in.ts'
import { init_service__openai_client } from '../service/llm.ts'

import { route__login } from '../handler/auth/oauth-login.ts'
import { route__static } from '../handler/static-files.ts'
import { route__auth_status } from '../handler/auth/status.ts'
import { route__chat__post_first_msg } from "../handler/chat.ts";

const env = parse_app_env()
const app_model = init_service__mongo_db(env.mongo_db_uri, 'MyGPT')
const session = init_service__session_maker(app_model, env.session_duration)
const sign_up_in = init_service__sign_up_in(app_model)
const llm_client = init_service__openai_client({
    base_url: env.llm_base_url,
    api_key: env.llm_api_key,
})

const service = {
    env,
    app_model,
    session,
    sign_up_in,
    llm_client,
}

init_server(env.port, service, [
    route__static,
    route__auth_status,
    route__login,
    route__chat__post_first_msg,
])

export
type I_app_service = typeof service
