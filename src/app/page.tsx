import { get_github_login_url } from 'ppz-oauth-login/github'
import styles from './page.module.css'
import { APP_ENV } from '@/back/service/env'

export default function Home() {
  return (
    <div className={styles.page}>
      <a href={get_github_login_url(APP_ENV.github_client_id)}>
        Login with GitHub
      </a>
    </div>
  )
}
