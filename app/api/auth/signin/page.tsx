'use client'
import { FC } from 'react'
import styles from '@/app/api/auth/signin/page.module.sass'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next//navigation'
import { FcGoogle } from 'react-icons/fc'
import Image from 'next/image'

const SignIn: FC = () => {

  const { data: session } = useSession()

  const router = useRouter()

  if (session) {
    router.push('/')
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
        </div>
      </main>
    )
  }
}

export default SignIn