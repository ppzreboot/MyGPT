import { useState } from 'react'

export
function Chat_screen() {
    const [msg, set_msg] = useState('')
    return <div>
        <textarea
            value={msg}
            onChange={evt => set_msg(evt.target.value)}
        />
        <button onClick={() => {
            fetch('/api/chat/first-msg', {
                method: 'POST',
                body: JSON.stringify({
                    msg,
                }),
            })
        }}>
            Send
        </button>
    </div>
}
