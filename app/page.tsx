'use client'
import { FC, useEffect, useState } from 'react'
import styles from './page.module.sass'
import ChatBox from '@/components/layouts/ChatBox'
import { useSession } from 'next-auth/react'
import db from '@/firebase/db'
import { ref, get, set } from 'firebase/database'
import { datasetLink } from '@/app/variables'
import { useModeContext } from '@/providers/ModeProvider'

const Home: FC = ({ }) => {
  const { data: session } = useSession({ required: true })
  const [authData, setAuthData] = useState<{ id: string, username: string } | null>(null)

  const { mode } = useModeContext()

  useEffect(() => {
    session && session.user.id !== authData?.id && setAuthData({ id: session.user.id, username: session.user.name })
    if (authData?.id) {
      localStorage.setItem('DAIBL_userId', authData.id!)
      const messageId = Date.now().toString()
      const dataRef = ref(db, `${mode}/${authData.id}`)

      get(dataRef).then(snapshot => {
        if (!snapshot.exists()) {
          set(ref(db, `${mode}/${authData.id}/messages/${messageId}`), {
            isComplete: false,
            isResult: true,
            text: mode === 'daibl' ? 
            `Xin chào **${authData.username}**! Tôi là **DAIBL**, mô hình máy học được huấn luyện để dự đoán cảm xúc từ bình luận của khách hàng về sản phẩm đã mua. Kết quả dự đoán bao gồm một trong các cảm xúc **tích cực**, **tiêu cực** hoặc **trung lập**. Bạn có thể đưa ra bình luận về sản phẩm, mô hình sẽ giúp dự đoán cảm xúc có trong bình luận của bạn, ví dụ:
            \n*-* Chất liệu vải khá tốt 👍
            \n*-* Giao hàng chậm, áo quá rộng 👎
            \n*-* Sản phẩm tạm ổn, chưa gọi là đẹp lắm 🤷
            \nTôi được huấn luyện bằng phương pháp Support Vector Machines (SVM) với bộ dữ liệu [Vietnamese Sentiment Analyst (Kaggle)](${datasetLink})`
            :
            `Xin chào **${authData.username}**! Tôi là **GEMINI**, một mô hình ngôn ngữ lớn được phát triển bởi Google AI. Tôi có thể thực hiện nhiều nhiệm vụ khác nhau như:
            \n*-* Viết các bài báo, email, bài thơ, kịch bản, v.v.
            \n*-* Dịch văn bản một cách chính xác và tự nhiên.
            \n*-* Trả lời các câu hỏi một cách đầy đủ và chính xác.
            \n*-* Viết mã và hướng dẫn lập trình.
            \nHãy thử hỏi tôi bất cứ điều gì bạn muốn!`
          })
        }
      })
    }
  }, [session, authData, mode])

  return (
    <main className={styles._container}>
      {session && <ChatBox />}
    </main>
  )
}

export default Home
