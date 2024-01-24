'use client'
import { FC, useEffect, useState } from 'react'
import styles from './page.module.sass'
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
              Xin chào <b>${session.user.name}</b>! Tôi tên <strong>DAIBL</strong>,
              một mô hình máy học được phát triển bởi
              😍 <a href="https://s.net.vn/0v2d" target="_blank">
              Trương Thành Đại BL</a> 😍 Tôi chỉ có thể giúp bạn dự đoán cảm xúc tích cực, tiêu cực
              hoặc trung lặp của các bình luận về chủ đề mua sắm thời trang. 
              <br/>
              Tôi được huấn luyện bằng phương pháp Support Vector Machines (SVM) 
              với bộ dữ liệu <a href="https://s.net.vn/3SdS"
              target="_blank">Vietnamese Sentiment Analyst (Kaggle)</a>.
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
