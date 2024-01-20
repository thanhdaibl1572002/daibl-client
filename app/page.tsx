'use client'
import { FC, useEffect, useState } from 'react'
import styles from './page.module.sass'
import Logo from '@/components/common/Logo'
import ChatBox from '@/components/layouts/ChatBox'
import { useSession } from 'next-auth/react'
import db from '@/firebase/db'
import { ref, get, set } from 'firebase/database'

const Home: FC = ({ }) => {
  const { data: session } = useSession({ required: true })
  const [authId, setAuthId] = useState(null)

  useEffect(() => {
    if (session && session.user.id !== authId) {
      setAuthId(session.user.id)
      localStorage.setItem('DAIBL_userId', session.user.id)
      const messageId = Date.now().toString()
      const dataRef = ref(db, `data/${session.user.id}`)

      get(dataRef).then((snapshot) => {
        if (!snapshot.exists()) {
          set(ref(db, `data/${session.user.id}/messages/${messageId}`), {
            isComplete: false,
            isResult: true,
            text: `
              Xin chào ${session.user.name}! Tôi tên DAIBL, tôi là một mô hình máy học được phát triển bởi
              😍 Trương Thành Đại - 3120410105 😍, có thể phân loại bình luận dựa trên cảm xúc
              dành riêng cho ngôn ngữ tiếng Việt. Tôi được huấn luyện bằng phương pháp phân loại
              văn bản Naive Bayes. Tôi chỉ có thể giúp bạn dự đoán cảm xúc tích cực, trung lập
              và tiêu cực của bình luận được nhập vào.
              `
          })
        }
      })
    }
  }, [session, authId])


  return (
    <main className={styles._container}>
      <ChatBox />
    </main>
  )
}

export default Home


{/* <TextArea />
<header>
  <Logo />
</header>
<ChatBox />
<button onClick={() => signOut()}>Đăng xuất</button> */}
