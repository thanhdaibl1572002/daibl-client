'use client'
import { FC } from 'react'
import styles from '@/app/api/auth/signin/page.module.sass'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

const SignIn: FC = () => {

  const { data: session } = useSession()

  const router = useRouter()

  if (session) {
    router.push('/')
    window.location.reload()
  } else {
    return (
      <main className={styles._container}>
        <div className={styles._login}>
          <button onClick={() => signIn('google', { callbackUrl: '/' })}>
            <span><FcGoogle /></span>
            <p>
              Đăng nhập với Google
            </p>
          </button>
          <button onClick={() => signIn('github', { callbackUrl: '/' })}>
            <span style={{ fontSize: 24 }}><FaGithub /></span>
            <p>
              Đăng nhập với Github
            </p>
          </button>
        </div>
      </main>
    )
  }
}

export default SignIn