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
          <Image
            src={'/images/common/logo.png'}
            alt={'DAIBL Logo'}
            width={200}
            height={200}
          />
          <div className={styles._welcome}>
            <h2>👋Xin chào👋</h2>
            <p>Chào mừng bạn đến với <strong>DAIBL</strong>, đăng nhập để sử dụng chat nhé 😍</p>
            {/* 👋 */}
          </div>
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