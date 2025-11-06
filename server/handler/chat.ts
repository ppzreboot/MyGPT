import { I_http_handler, I_route } from '../type.ts'

export
const route__chat__post_first_msg: I_route = (method, url) =>
    method === 'POST' && url.pathname === '/api/chat/first-msg'
        ? post_first_msg
        : null

const post_first_msg: I_http_handler = async (req, service) => {
    const { msg } = await req.json()
    return Response.json({
        error: false,
        data: await service.llm_client.title_chat(msg)
    })

    // service.app_model.chat.insertOne({
    //     title: msg,
    // })
    // service.app_model.msg.insertOne({

    // })
}
