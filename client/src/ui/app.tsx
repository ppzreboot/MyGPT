import { useEffect, useState } from 'react'
import { retrieve__auth_status, type I_auth_status } from '../api/auth'
import { Chat_screen } from './chat'

export
function App() {
  const [state, set_state] = useState<I_auth_status | null>(null)
  useEffect(() => {
    retrieve__auth_status().then(set_state)
  }, [])

  if (state === null)
    return <div>Loading Auth Status</div>
  if (state.signed_in)
    return <Chat_screen />
  return <ul>
    {state.oauth_list.map(oauth =>
        <li>
            <a href={oauth.link}>{oauth.key}</a>
        </li>
    )}
  </ul>
}
