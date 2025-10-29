import { get_github_login_url } from 'ppz-oauth-login/github'
import styles from './page.module.css'
import { APP_ENV } from '@/back/service/env'
import { get_current_user } from '@/back/service/session'

export default async function Home() {
  const user = await get_current_user()
  return (
    <div className={styles.page}>
      {typeof(user) === 'string'
        ? <a href={get_github_login_url(APP_ENV.github_client_id)}>
          Login with GitHub
        </a>
        : <div>
          Hello, {JSON.stringify(user)}
        </div>
      }
    </div>
  )
}
