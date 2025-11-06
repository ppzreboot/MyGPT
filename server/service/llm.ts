import OpenAI from '@openai/openai'
import { z } from '@zod/zod'
import { zodResponseFormat } from '@openai/openai/helpers/zod'

export
function init_service__openai_client(opts: {
    base_url: string
    api_key: string
}) {
    const client = new OpenAI({
        baseURL: opts.base_url,
        apiKey: opts.api_key,
    })
    // const Authorization = 'Bearer ' + opts.api_key
    return {
        async title_chat(msg: string): string {
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
    }
}
