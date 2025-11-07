import OpenAI from '@openai/openai'
import { I_app_model } from './mongo.ts'
import { z } from '@zod/zod'
import { zodResponseFormat } from '@openai/openai/helpers/zod'

export
function init_service__openai_client(opts: {
    base_url: string
    api_key: string
    app_model: I_app_model
}) {
    const client = new OpenAI({
        baseURL: opts.base_url,
        apiKey: opts.api_key,
    })
    const app_model = opts.app_model

    async function title_chat(msg: string): string {
        const result = await client.chat.completions.parse({
            model: 'grok-4-fast-reasoning',
            response_format: zodResponseFormat(
                z.object({
                    title: z.string(),
                }),
                'title',
            ),
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates concise, natural-sounding chat titles based on user messages.',
                },
                {
                    role: 'user',
                    content: 'The following content is entirely from the user. '
                        + 'Please generate a short, clear title that summarizes the main topic.'
                        + '\n\n\n\n'
                        + msg,
                },
            ],
        })
        return result.choices[0].message.parsed.title
    }

    async function send_new_msg(chat_id: ObjectId): string {
        // retieve history msg
        const msg_history = await app_model.msg.find({
            chat_id,
        }).toArray()
        const last_msg = msg_history.pop()
        
        // send
        const result = await client.chat.completions.parse({
            model: 'grok-4-fast-reasoning',
            messages: [
                ...msg_history.map(msg => [
                    { role: 'user', content: msg.user },
                    { role: 'assistant', content: msg.assistant },
                ]),
                [{ role: 'user', content: last_msg.user }]
            ].flat(),
        })

        return result.choices[0].message.content
    }

    return {
        async create_chat(msg: string) {
            const now = new Date()

            // create chat
            const title = await title_chat(msg)
            const chat_record = await app_model.chat.insertOne({
                title,
                created_at: now,
            })
            
            // insert new msg
            const msg_record = await app_model.msg.insertOne({
                chat_id: chat_record.insertedId,
                model_type: 'grok-4-fast-reasoning',
                user: msg,
                created_at: now,
            })

            // send to llm
            const answer = await send_new_msg(chat_record.insertedId)

            // update the new msg
            await app_model.msg.updateOne(
                { _id: msg_record.insertedId },
                { $set: {
                    assitant: answer,
                }},
            )

            return { title, answer }
        }
    }
}
